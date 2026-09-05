#!/bin/bash
# PreToolUse hook (matcher: Bash). Blocks `git commit` / `git push` unless both
# the frontend and backend test suites pass. See .claude/rules/*-unit-tests.md.
#
# Uses `node` (not jq) to parse/build JSON since this is a Node project and
# node is already required to run it — no extra dependency to install.

REPO="/Users/domle/projects/purrfect-market"

input=$(cat)
cmd=$(node -e '
  let data = "";
  process.stdin.on("data", c => { data += c; });
  process.stdin.on("end", () => {
    try {
      const j = JSON.parse(data);
      process.stdout.write((j.tool_input && j.tool_input.command) || "");
    } catch {
      process.stdout.write("");
    }
  });
' <<< "$input")

if ! echo "$cmd" | grep -qE '\bgit\b.*\b(commit|push)\b'; then
  exit 0
fi

fe_output=$(cd "$REPO/Frontend" && npm test 2>&1)
fe_status=$?

be_output=$(cd "$REPO/Backend" && mvn test 2>&1)
be_status=$?

if [ $fe_status -ne 0 ] || [ $be_status -ne 0 ]; then
  reason="Tests failed — commit/push blocked."$'\n\n'
  if [ $fe_status -ne 0 ]; then
    reason="${reason}--- Frontend (npm test) FAILED ---"$'\n'"$(echo "$fe_output" | tail -c 3000)"$'\n\n'
  fi
  if [ $be_status -ne 0 ]; then
    reason="${reason}--- Backend (mvn test) FAILED ---"$'\n'"$(echo "$be_output" | tail -c 3000)"$'\n\n'
  fi
  REASON="$reason" node -e '
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: process.env.REASON
      }
    }));
  '
  exit 0
fi

exit 0
