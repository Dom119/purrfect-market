package com.purrfectmarket.config;

import com.purrfectmarket.model.Review;
import com.purrfectmarket.repository.ProductRepository;
import com.purrfectmarket.repository.ReviewRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@Order(2)
public class ReviewSeeder implements CommandLineRunner {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    public ReviewSeeder(ReviewRepository reviewRepository, ProductRepository productRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (reviewRepository.count() > 0) return;

        Map<String, Long> idByName = productRepository.findAll().stream()
                .collect(Collectors.toMap(p -> p.getName(), p -> p.getId(), (a, b) -> a));

        List<Review> reviews = new ArrayList<>();
        Instant now = Instant.now();

        // ── Organic Salmon Feast ──────────────────────────────────────────────
        Long salmonId = idByName.get("Organic Salmon Feast");
        if (salmonId != null) {
            reviews.addAll(List.of(
                new Review(salmonId, "Sarah M.", 5, "My picky eater LOVES this", "I have tried every brand on the market and my cat turned her nose up at all of them. This salmon feast is the first food she finishes every single bowl. The ingredients look clean and I feel good about what I'm feeding her.", now.minus(2, ChronoUnit.DAYS)),
                new Review(salmonId, "James T.", 5, "Incredible quality for the price", "You can actually smell the real salmon — no fishy artificial scent. My two cats demolished it and now sit by their bowls waiting for meal time. Worth every penny.", now.minus(5, ChronoUnit.DAYS)),
                new Review(salmonId, "Linda K.", 5, "Coat is noticeably shinier", "After three weeks on this food my vet commented on how shiny my cat's coat looks. She said the omega-3 content makes a real difference. Already reordered.", now.minus(9, ChronoUnit.DAYS)),
                new Review(salmonId, "Carlos R.", 4, "Great food, slightly pricey", "The quality is excellent and my cat clearly loves it. Knocked off one star only because the price point is a little high for daily feeding, but I treat it as a top-up alongside dry food.", now.minus(14, ChronoUnit.DAYS)),
                new Review(salmonId, "Priya N.", 5, "Vet recommended, cat approved", "Our vet suggested moving to a grain-free option after my cat had some digestive issues. This food sorted everything out within a week. So grateful we found it.", now.minus(21, ChronoUnit.DAYS)),
                new Review(salmonId, "Tom H.", 5, "Nothing but the best for Mr Whiskers", "I read every label before I buy cat food. This one has wild-caught salmon as the first ingredient and zero fillers. Mr Whiskers runs to the kitchen the moment he hears the bag rustle.", now.minus(30, ChronoUnit.DAYS)),
                new Review(salmonId, "Emily S.", 5, "Senior cat loves it too", "My 14-year-old tabby has become a fussy eater in her old age but she clears this bowl every time. The soft texture seems easier for her to eat as well.", now.minus(45, ChronoUnit.DAYS)),
                new Review(salmonId, "Mark D.", 4, "Solid product overall", "Good quality and my cat enjoys it. Packaging could be improved — the bag doesn't reseal well — but the food itself is excellent.", now.minus(60, ChronoUnit.DAYS)),
                new Review(salmonId, "Aisha B.", 5, "Finally a food they both agree on", "I have two cats with very different tastes. This is the FIRST food both of them eat happily. That alone makes it a five-star product in my house.", now.minus(75, ChronoUnit.DAYS)),
                new Review(salmonId, "Kevin L.", 5, "Subscription auto-refill is great", "Set up auto-delivery and it arrives just as we're running low. Food itself is top quality — no stomach upsets since switching from our old brand.", now.minus(90, ChronoUnit.DAYS)),
                new Review(salmonId, "Rachel W.", 3, "Good but my cat is still picky", "Decent quality and my cat ate it for the first week but then started leaving half the bowl. Might just be her personality. The ingredients list is impressive though.", now.minus(100, ChronoUnit.DAYS)),
                new Review(salmonId, "David P.", 5, "Best food on the market", "I have been searching for a truly grain-free, high-protein cat food for years. This is it. My rescue cat who arrived underweight has put on healthy weight and his energy levels are up.", now.minus(115, ChronoUnit.DAYS))
            ));
        }

        // ── Feather Wand Toy ─────────────────────────────────────────────────
        Long wandId = idByName.get("Feather Wand Toy");
        if (wandId != null) {
            reviews.addAll(List.of(
                new Review(wandId, "Olivia C.", 5, "My cat goes absolutely wild for this", "I've had three different wand toys and this is by far the best. The feathers are full and realistic and my cat pounces like a kitten even though she's eight years old. Great workout!", now.minus(1, ChronoUnit.DAYS)),
                new Review(wandId, "Nathan F.", 5, "Best bonding toy we've found", "Fifteen minutes with this wand before bed and my cat settles down perfectly for the night. He's more affectionate since we started this routine. Highly recommend.", now.minus(4, ChronoUnit.DAYS)),
                new Review(wandId, "Sophie L.", 4, "Feathers need occasional replacement", "The toy itself is great and my cat loves it. The feathers do wear out after a few weeks of vigorous play so keep that in mind. Would love replacement refills available.", now.minus(10, ChronoUnit.DAYS)),
                new Review(wandId, "Alex G.", 5, "Got my lazy cat off the sofa", "My vet said my cat needed more exercise. This wand was the answer. He chases it around for 20 minutes straight and then sleeps like a log. Lost half a kilo in two months!", now.minus(18, ChronoUnit.DAYS)),
                new Review(wandId, "Mei C.", 5, "Natural feathers make a difference", "Tried a plastic feather toy before and my cat ignored it. The natural feathers on this one make it move so realistically she genuinely thinks she's hunting. Amazing to watch.", now.minus(25, ChronoUnit.DAYS)),
                new Review(wandId, "Jake R.", 4, "Great but handle could be sturdier", "My cats are rough players and bent the wand a little after a month of daily use. The play experience itself is fantastic though, just wished the handle was a bit thicker.", now.minus(35, ChronoUnit.DAYS)),
                new Review(wandId, "Hannah B.", 5, "Multi-cat household approved", "I have four cats and they actually take turns chasing this wand — usually there's fighting over toys but this one has everyone entertained. Fantastic value.", now.minus(50, ChronoUnit.DAYS)),
                new Review(wandId, "Ryan K.", 5, "Perfect for kittens too", "Got this for our eight-week-old kitten and she can't get enough of it. Great for developing coordination and burning off all that kitten energy.", now.minus(65, ChronoUnit.DAYS)),
                new Review(wandId, "Zoe M.", 5, "Kept my cats entertained for months", "Still going strong after four months of daily play. The feathers are more durable than expected. My cats light up every time I pick it up.", now.minus(80, ChronoUnit.DAYS)),
                new Review(wandId, "Chris T.", 3, "Cat loved it then lost interest", "My cat was obsessed for the first two weeks then completely ignored it. Maybe he figured out it wasn't real prey. Rotating with other toys might help keep the novelty.", now.minus(95, ChronoUnit.DAYS)),
                new Review(wandId, "Anna S.", 5, "Simple but brilliant", "Sometimes the simplest toys are the best. Dangling feathers on a stick — that's all it is and my cats absolutely love it. Best three pounds I've ever spent on them.", now.minus(110, ChronoUnit.DAYS)),
                new Review(wandId, "Michael H.", 5, "Vet approved for exercise", "My vet told me to play with my cat more for mental stimulation and weight management. This wand makes that so easy and fun for both of us.", now.minus(130, ChronoUnit.DAYS))
            ));
        }

        // ── Cozy Cave Bed ────────────────────────────────────────────────────
        Long caveId = idByName.get("Cozy Cave Bed");
        if (caveId != null) {
            reviews.addAll(List.of(
                new Review(caveId, "Fiona R.", 5, "My cat hasn't left it since day one", "I set this up in the corner of the bedroom and my cat walked straight in and curled up. She sleeps in it every night and looks so peaceful. The plush material is incredibly soft.", now.minus(3, ChronoUnit.DAYS)),
                new Review(caveId, "Ben A.", 5, "Perfect for anxious cats", "My rescue cat used to hide under the bed. Since getting this cave bed he has somewhere safe that's actually out in the room. He's become much more confident and social.", now.minus(8, ChronoUnit.DAYS)),
                new Review(caveId, "Claire M.", 4, "Great quality, runs slightly small", "Fantastic quality and my medium-sized cat loves it. Just note that it runs a little small so if you have a large cat, size up. The washable cover is a genuine lifesaver.", now.minus(15, ChronoUnit.DAYS)),
                new Review(caveId, "Harry V.", 5, "Machine washable — what a win", "Whoever decided to make the cover machine washable deserves an award. Our cats are messy and being able to chuck it in the washing machine keeps it fresh. Great design.", now.minus(22, ChronoUnit.DAYS)),
                new Review(caveId, "Isabel T.", 5, "Looks great in our living room too", "Not only do our cats love it but it actually looks nice as a piece of home decor. Blends in well with our furniture and doesn't look like an eyesore like some pet beds.", now.minus(32, ChronoUnit.DAYS)),
                new Review(caveId, "Sam P.", 3, "My cat prefers the box it came in", "Quality is genuinely good but my particular cat showed zero interest and went to sleep in the delivery box instead. Might depend entirely on your cat's personality.", now.minus(42, ChronoUnit.DAYS)),
                new Review(caveId, "Nora J.", 5, "Three cats, all want to use it", "I've had to order two more because all three of my cats fight over the one. It's clearly a premium product — warm, cosy and the right size for them to feel secure.", now.minus(55, ChronoUnit.DAYS)),
                new Review(caveId, "Liam B.", 5, "Perfect winter bed", "My cat refuses to sleep anywhere cold in winter. This cave bed retains heat brilliantly — he goes in around 9pm and doesn't come out until morning. Worth every penny.", now.minus(68, ChronoUnit.DAYS)),
                new Review(caveId, "Grace O.", 4, "Holds its shape well after washing", "After three washes it still looks like new. A previous cave bed I had went misshapen after the first wash so this is a big step up. Very happy with it overall.", now.minus(78, ChronoUnit.DAYS)),
                new Review(caveId, "Patrick N.", 5, "Best purchase for my cat this year", "My cat was sleeping on top of the radiator which I hated. Placed this near the radiator instead and she moved straight in. She's safe, warm, and I'm not worried anymore.", now.minus(88, ChronoUnit.DAYS))
            ));
        }

        // ── Dental Chew Sticks ───────────────────────────────────────────────
        Long dentalId = idByName.get("Dental Chew Sticks");
        if (dentalId != null) {
            reviews.addAll(List.of(
                new Review(dentalId, "Laura H.", 5, "Vet noticed cleaner teeth at check-up", "My vet actually commented at the last check-up that my cat's teeth look cleaner than before. The only thing I changed was adding these chew sticks. Incredible results.", now.minus(2, ChronoUnit.DAYS)),
                new Review(dentalId, "Pete S.", 5, "My cat treats them like a daily treat", "He gets excited every evening when he sees the packet come out. Chews them slowly and thoroughly which is exactly what I want for dental health. Natural ingredients too — no nasties.", now.minus(6, ChronoUnit.DAYS)),
                new Review(dentalId, "Wendy C.", 5, "Fresher breath noticeably", "Within a week I could tell the difference in my cat's breath. Not unpleasant anymore. My friends who visit have also commented she smells better when she gets close. These really work.", now.minus(12, ChronoUnit.DAYS)),
                new Review(dentalId, "Gary M.", 4, "Good product, cats took time to adjust", "My cats were suspicious at first and sniffed them for a few days before eating. Once they got used to them they eat one each every evening no problem. Glad I persisted.", now.minus(20, ChronoUnit.DAYS)),
                new Review(dentalId, "Donna F.", 5, "Better than tooth brushing battles", "Trying to brush my cat's teeth is a war. These sticks are something she actually wants to chew on and the dental benefit seems just as good based on our vet visits. A lifesaver.", now.minus(28, ChronoUnit.DAYS)),
                new Review(dentalId, "Steve B.", 5, "Clean ingredients, works great", "Read the label carefully before buying — no artificial colours or preservatives. The natural mint keeps breath fresh and the texture is effective at scraping plaque. Very impressed.", now.minus(38, ChronoUnit.DAYS)),
                new Review(dentalId, "Karen T.", 5, "Both my cats love them", "Different cats, different personalities, but both of mine go crazy for these sticks. They eat them in under a minute and then look up hoping for more. Ordered a six-month supply.", now.minus(50, ChronoUnit.DAYS)),
                new Review(dentalId, "John R.", 4, "Effective but a bit pricey per stick", "The dental results are real — I can see the tartar reducing. Just wish the per-stick cost was a bit lower for daily use. Still buying them though because they genuinely work.", now.minus(62, ChronoUnit.DAYS)),
                new Review(dentalId, "Anne W.", 5, "Vet recommended brand", "My vet suggested these after noticing early tartar buildup. Three months later at the follow-up she said the situation had improved noticeably. Couldn't be happier.", now.minus(75, ChronoUnit.DAYS)),
                new Review(dentalId, "Chris L.", 3, "Works but cat prefers other treats", "The dental benefit seems real but my cat only eats these reluctantly. She much prefers her usual treats. I mix one in with her normal treats to get her to eat it.", now.minus(88, ChronoUnit.DAYS)),
                new Review(dentalId, "Julia P.", 5, "No more expensive dental cleaning fees", "Our cat used to need an annual dental clean under anaesthetic. Since using these daily our vet said we may be able to skip it this year. The savings alone justify the cost.", now.minus(100, ChronoUnit.DAYS)),
                new Review(dentalId, "Rob H.", 5, "Subscribe and save is a great deal", "Set up a subscription and the discount brings the cost per stick down to a very reasonable level. Combined with how well they work, this is a no-brainer purchase.", now.minus(115, ChronoUnit.DAYS))
            ));
        }

        // ── Tuna & Chicken Pate ──────────────────────────────────────────────
        Long pateId = idByName.get("Tuna & Chicken Pate");
        if (pateId != null) {
            reviews.addAll(List.of(
                new Review(pateId, "Amy J.", 5, "My cat eats every last bit", "She used to leave food in the bowl but since switching to this pate she licks it completely clean every single time. The real tuna and chicken smell is strong — in a good way.", now.minus(1, ChronoUnit.DAYS)),
                new Review(pateId, "Brian K.", 5, "No artificial flavours, you can tell", "Compared to cheaper brands the texture is smoother and the smell more natural. My cat is a sensitive eater and has had no digestive issues at all. Brilliant product.", now.minus(5, ChronoUnit.DAYS)),
                new Review(pateId, "Cathy R.", 4, "Excellent quality, portion size small", "The quality is outstanding but the individual portions feel a little small for my larger cat — he needs two per meal. Still five stars for quality, four for value.", now.minus(11, ChronoUnit.DAYS)),
                new Review(pateId, "Derek N.", 5, "Converted my dry-food-only cat", "My cat refused to eat wet food for four years. After trying several brands I tried this one and he absolutely loved it from the first serving. The texture must be just right.", now.minus(19, ChronoUnit.DAYS)),
                new Review(pateId, "Emma S.", 5, "Hydration boost my vet recommended", "My vet said my cat needed more hydration. Switching to wet food daily was the advice and this pate has been perfect for that. His kidney markers improved at the next blood test.", now.minus(27, ChronoUnit.DAYS)),
                new Review(pateId, "Fred T.", 4, "Great taste, watch the sodium content", "My cat loves it and the ingredients are mostly excellent. Just worth noting the sodium content is slightly higher than other brands if you have a cat with blood pressure concerns.", now.minus(36, ChronoUnit.DAYS)),
                new Review(pateId, "Gemma P.", 5, "The smell test — passed with flying colours", "I know this sounds odd but I smell-tested it before buying more. It smells like real fish and chicken, not processed pet food. My cat agrees — she starts meowing the moment I open a packet.", now.minus(48, ChronoUnit.DAYS)),
                new Review(pateId, "Henry M.", 5, "Perfect for post-surgery recovery", "My cat needed soft food after dental surgery. This pate was ideal — smooth texture, appealing taste, and high in protein to support recovery. He bounced back quickly.", now.minus(60, ChronoUnit.DAYS)),
                new Review(pateId, "Isla B.", 5, "Older cat eating well again", "My 16-year-old cat had lost her appetite. This pate brought it back — she eats a full portion twice a day now. The smooth texture is easy for her to manage.", now.minus(72, ChronoUnit.DAYS)),
                new Review(pateId, "Jack D.", 3, "Good but my cat prefers chunky food", "Quality is clearly there and my cat eats it. He just seems to prefer chunkier wet foods over pate. Might be a texture preference. Would be great if a chunky version was available.", now.minus(85, ChronoUnit.DAYS)),
                new Review(pateId, "Karen L.", 5, "Buy in bulk and save a lot", "Ordered a 24-pack and the per-unit cost is fantastic for this quality level. My cat has eaten it daily for six months with no issues whatsoever. Completely reliable.", now.minus(98, ChronoUnit.DAYS)),
                new Review(pateId, "Leo C.", 5, "Even my vet uses this brand", "Mentioned it at my cat's check-up and my vet said she uses the same brand for her own cats. That was all I needed to hear. Top quality nutrition.", now.minus(112, ChronoUnit.DAYS))
            ));
        }

        // ── Laser Pointer Toy ────────────────────────────────────────────────
        Long laserId = idByName.get("Laser Pointer Toy");
        if (laserId != null) {
            reviews.addAll(List.of(
                new Review(laserId, "Max W.", 5, "Endless entertainment for us both", "I sit on the sofa and move this around the floor and walls while my cat goes absolutely berserk. It's as entertaining for me to watch as it is for him to chase. Brilliant.", now.minus(2, ChronoUnit.DAYS)),
                new Review(laserId, "Nina P.", 4, "Great but finish with a physical toy", "Important tip: always end the laser session by moving to a physical toy your cat can catch. Otherwise they get frustrated never being able to grab the dot. Once I started doing this, five stars.", now.minus(7, ChronoUnit.DAYS)),
                new Review(laserId, "Oliver S.", 5, "Multiple patterns keep it interesting", "The different patterns mean my cats don't get bored of the same dot movement. The spiral mode is their favourite — they go completely mental trying to catch it.", now.minus(15, ChronoUnit.DAYS)),
                new Review(laserId, "Paula G.", 5, "Best cardio for indoor cats", "My indoor cats don't get much natural exercise opportunity. Ten minutes with this laser every evening and they're sprinting around the room. Their weight has improved since we started.", now.minus(24, ChronoUnit.DAYS)),
                new Review(laserId, "Quinn T.", 4, "Batteries drain quicker than expected", "Fun toy and cats love it, but the batteries seem to run down faster than I'd expected — maybe once a month with regular use. Not a dealbreaker but just worth knowing.", now.minus(33, ChronoUnit.DAYS)),
                new Review(laserId, "Rita K.", 5, "My shy cat opened up because of this", "My rescue cat was very timid and wouldn't engage with any toys. The laser dot was the first thing that got her off the hiding spot. She's so much more playful now.", now.minus(44, ChronoUnit.DAYS)),
                new Review(laserId, "Simon H.", 3, "One of my cats doesn't get it", "My younger cat is obsessed with it. My older cat completely ignores the dot and just watches his brother run around. Fifty percent success rate in my household.", now.minus(56, ChronoUnit.DAYS)),
                new Review(laserId, "Tara N.", 5, "So easy to use", "Compact, lightweight, easy button press. I can use it one-handed while doing something else. My cat gets exercise without me having to run around after him. Perfect.", now.minus(68, ChronoUnit.DAYS)),
                new Review(laserId, "Uma R.", 5, "Great for the whole family", "The kids love operating this as much as the cat loves chasing it. It's become a family activity every evening. Good quality and the beam is bright and visible even in daylight.", now.minus(82, ChronoUnit.DAYS)),
                new Review(laserId, "Victor M.", 4, "Solid product, easy to lose", "Works great but it's very small and I've lost it twice already — once down the sofa and once in a coat pocket. Worth attaching to a keyring or keeping in a specific spot.", now.minus(96, ChronoUnit.DAYS)),
                new Review(laserId, "Wendy A.", 5, "Budget-friendly with real results", "At this price point I expected a basic product. The multiple patterns and solid build quality genuinely surprised me. My cats have been using it daily for three months and it still works perfectly.", now.minus(110, ChronoUnit.DAYS)),
                new Review(laserId, "Xander F.", 5, "Helped my cat lose weight", "Vet suggested more activity for my slightly overweight cat. Twenty minutes of laser chasing five times a week and he's lost the weight she recommended. Such a simple solution.", now.minus(125, ChronoUnit.DAYS))
            ));
        }

        // ── Window Perch ─────────────────────────────────────────────────────
        Long perchId = idByName.get("Window Perch");
        if (perchId != null) {
            reviews.addAll(List.of(
                new Review(perchId, "Yvonne B.", 5, "My cat's favourite spot in the house", "From the moment I installed this my cat claimed it and has barely left. She watches birds for hours. The suction cups are incredibly strong — not a wobble in four months.", now.minus(3, ChronoUnit.DAYS)),
                new Review(perchId, "Zach R.", 5, "Holds a 6kg cat no problem", "I was worried about the weight limit but my 6kg Maine Coon sits on this with zero signs of strain. The engineering is solid and the suction cup seal is very secure.", now.minus(8, ChronoUnit.DAYS)),
                new Review(perchId, "Alice T.", 4, "Easy install, just clean the glass first", "Installation took five minutes. One tip: clean the glass really thoroughly before attaching — that makes all the difference to how strongly the cups grip. Works great once done.", now.minus(16, ChronoUnit.DAYS)),
                new Review(perchId, "Ben C.", 5, "Solved my window-opening problem", "My cat used to try to climb onto the window ledge which was dangerous with how old the window is. This gives him a safe elevated perch right by the glass. He loves bird-watching.", now.minus(25, ChronoUnit.DAYS)),
                new Review(perchId, "Clara V.", 5, "Frees up windowsill space too", "Our windowsill was covered in cat fluff from her sitting there. The perch mounts mid-window, leaves the sill clear, and she's happier because the view is better. Win-win.", now.minus(35, ChronoUnit.DAYS)),
                new Review(perchId, "Dom S.", 4, "Great for apartments", "No garden or outdoor access in our flat, so this perch gives our cat the mental stimulation of watching the world outside. He's calmer and less destructive. Thoroughly recommend.", now.minus(46, ChronoUnit.DAYS)),
                new Review(perchId, "Eve N.", 3, "Suction cups occasionally lose grip in cold", "Works brilliantly most of the year but when our conservatory gets very cold in winter the suction cups occasionally let go slightly. Worth checking in colder weather.", now.minus(58, ChronoUnit.DAYS)),
                new Review(perchId, "Felix W.", 5, "Looks sleek and modern", "Most cat furniture looks terrible in a nice home. This perch is clean and minimal and doesn't look out of place at all. My partner who hates cat furniture actually approved it.", now.minus(70, ChronoUnit.DAYS)),
                new Review(perchId, "Gina M.", 5, "Two cats share it surprisingly well", "I thought there would be fights but my two cats have worked out a time-sharing arrangement. One goes up in the morning and the other in the afternoon. Hilarious to observe.", now.minus(85, ChronoUnit.DAYS)),
                new Review(perchId, "Hugo P.", 5, "Enrichment for indoor cats", "Our indoor cats need environmental enrichment. This window perch gives them something real to watch and their behaviour has improved enormously — less attention-seeking and destructive behaviour.", now.minus(100, ChronoUnit.DAYS)),
                new Review(perchId, "Iris L.", 4, "Washable pad is a bonus", "The removable padded mat is a great touch — it's in the washing machine every couple of weeks and comes out fine. Just a bit small for my larger cat to stretch out fully on.", now.minus(115, ChronoUnit.DAYS)),
                new Review(perchId, "Jake B.", 5, "My cat's mental health improved", "This sounds dramatic but my indoor cat was showing signs of boredom and anxiety. After getting this perch she has something to watch all day and the change in her mood is remarkable.", now.minus(130, ChronoUnit.DAYS))
            ));
        }

        // ── Slicker Brush ────────────────────────────────────────────────────
        Long brushId = idByName.get("Slicker Brush");
        if (brushId != null) {
            reviews.addAll(List.of(
                new Review(brushId, "Kevin A.", 5, "Transformed grooming time", "My long-haired cat used to dread being brushed. This slicker brush is so gentle she actually leans into it now. Gets through tangles without pulling and removes masses of loose fur.", now.minus(2, ChronoUnit.DAYS)),
                new Review(brushId, "Lisa M.", 5, "Fur everywhere is now fur in the brush", "Since using this brush I've cut my lint-rolling time in half. All the loose fur that was ending up on the sofa now ends up in the brush instead. Huge quality of life improvement.", now.minus(6, ChronoUnit.DAYS)),
                new Review(brushId, "Matt P.", 5, "Vet recommended for mat prevention", "My vet suggested daily brushing after my Persian developed a mat. This brush makes that routine easy and actually enjoyable for my cat. No mats since we started.", now.minus(13, ChronoUnit.DAYS)),
                new Review(brushId, "Nancy F.", 4, "Brilliant, just clean it regularly", "The brush collects a lot of fur very efficiently. You do need to clear it out every few strokes when doing a heavy brushing session, but that's normal. Easy to clean overall.", now.minus(21, ChronoUnit.DAYS)),
                new Review(brushId, "Oscar T.", 5, "My cats actively come to me for grooming now", "Never thought I'd say this but my cats actually come and headbutt the brush when they want to be groomed. The bristles must feel amazing to them. Best cat purchase I've made.", now.minus(30, ChronoUnit.DAYS)),
                new Review(brushId, "Pam S.", 5, "Perfect for sensitive skin", "My elderly cat has sensitive skin and some brushes were too harsh. These bristles are firm enough to be effective but gentle enough not to irritate. She purrs throughout the whole session.", now.minus(42, ChronoUnit.DAYS)),
                new Review(brushId, "Quinn B.", 3, "Good brush, handle a bit slippery", "The brush itself is effective and my cat is happy with it. My only complaint is that the handle can get a bit slippery if your hands are slightly damp. A rubberised grip would be better.", now.minus(54, ChronoUnit.DAYS)),
                new Review(brushId, "Rose G.", 5, "Reduced hairballs significantly", "My cat used to throw up hairballs twice a week. Since daily brushing with this we're down to maybe once a fortnight. The amount of fur it removes is astonishing.", now.minus(66, ChronoUnit.DAYS)),
                new Review(brushId, "Sam N.", 5, "Double-coated cat approved", "My Maine Coon has a dense double coat that defeats most brushes. This slicker brush gets through both layers efficiently without any discomfort. He sits still for the whole grooming session.", now.minus(80, ChronoUnit.DAYS)),
                new Review(brushId, "Tina C.", 5, "Great for bonding too", "Grooming is one of the best ways to bond with your cat and this brush makes the experience pleasant for both of you. My cat purrs the whole time and I find it relaxing too.", now.minus(95, ChronoUnit.DAYS)),
                new Review(brushId, "Uma K.", 4, "Effective, pin depth could be deeper", "Works well for my medium-haired cat. For very long or thick coats I imagine you'd want longer pins. Great quality build and comfortable handle though.", now.minus(108, ChronoUnit.DAYS)),
                new Review(brushId, "Victor L.", 5, "Best investment for any cat owner", "I wish I'd bought this years ago. The amount of fur it removes in one session is remarkable. My furniture is cleaner, my cat's coat looks glossier, and she actually enjoys being brushed.", now.minus(122, ChronoUnit.DAYS))
            ));
        }

        // ── Another product (id=10, 10 reviews) ──────────────────────────────
        Long otherId = idByName.get("Another product");
        if (otherId != null) {
            reviews.addAll(List.of(
                new Review(otherId, "Will D.", 5, "Exceeded my expectations", "I wasn't sure what to expect from this product but it's genuinely impressive. My cat took to it immediately and I can already see the benefit after just a couple of weeks.", now.minus(4, ChronoUnit.DAYS)),
                new Review(otherId, "Xena P.", 4, "Good quality, arrived quickly", "Solid product and delivery was faster than expected. My cat needed a day to get used to it but is now very happy. Would recommend to other cat owners.", now.minus(12, ChronoUnit.DAYS)),
                new Review(otherId, "Yara S.", 5, "My cat's new favourite", "Introduced this to my cat last week and she has already claimed it as her own. Everything about it feels well made and thoughtfully designed for cats.", now.minus(22, ChronoUnit.DAYS)),
                new Review(otherId, "Zane M.", 4, "Does exactly what it says", "No surprises here — product does exactly what it promises. My cat is happy and I'm happy. Simple as that.", now.minus(35, ChronoUnit.DAYS)),
                new Review(otherId, "Amy B.", 5, "Great value for the quality", "I compared several options before buying and this offered the best combination of quality and price. Very satisfied with the purchase.", now.minus(48, ChronoUnit.DAYS)),
                new Review(otherId, "Ben T.", 3, "Mixed feelings", "The product itself is fine but it took my cat longer than expected to take to it. Might depend on the individual cat. Customer service was helpful when I reached out.", now.minus(60, ChronoUnit.DAYS)),
                new Review(otherId, "Cara N.", 5, "Would buy again", "Already on my second order. My cat loves it and the quality has held up well. Exactly what I was looking for.", now.minus(72, ChronoUnit.DAYS)),
                new Review(otherId, "Dan K.", 4, "Cats approved", "Both my cats seem happy with it. Well made and does its job. Minor packaging could be improved but the product itself is great.", now.minus(85, ChronoUnit.DAYS)),
                new Review(otherId, "Eva R.", 5, "Highly recommend", "Introduced this after a friend's recommendation and I'm so glad I did. My cat's quality of life has genuinely improved and that's all I care about.", now.minus(98, ChronoUnit.DAYS)),
                new Review(otherId, "Fred L.", 4, "Good but check sizing", "Great product overall. Just make sure you check the dimensions before ordering to ensure it fits your space or suits your cat's size. Perfect once I sorted that out.", now.minus(110, ChronoUnit.DAYS))
            ));
        }

        reviewRepository.saveAll(reviews);
    }
}
