import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Only seed if no modules exist
  const count = await prisma.module.count();
  if (count > 0) {
    console.log(`Skipping seed — ${count} modules already in DB.`);
    return;
  }

  const modules = [
    {
      id: 1, phase: 1, order: 1,
      title: "The Heart of a Servant Leader",
      subtitle: "Foundations of Ministry Leadership",
      type: "article", duration: "12 min read",
      skills: { servanthood: 18, vision: 8 },
      category: "Foundation", categoryColor: "#c49a3c",
      excerpt: "Discover the paradox at the core of Christian leadership — true authority flows from radical humility.",
      content: [
        { heading: "The Upside-Down Kingdom", body: "The world defines leadership by status, power, and influence over others. But Christ introduces a revolutionary paradox: the greatest among you shall be your servant (Matthew 23:11). Before we discuss strategies, models, or methodologies, we must settle the foundational question — whose kingdom are we building?" },
        { heading: "Washing Feet as a Leadership Model", body: "In John 13, Jesus takes a basin and towel — the tools of the lowest servant — and washes his disciples' feet. This was not a symbolic gesture. It was a deliberate, shocking redefinition of what it means to lead. He then commands: 'Now that I, your Lord and Teacher, have washed your feet, you also should wash one another's feet.' Leadership in ministry begins at the basin, not the pulpit." },
        { heading: "The Three Motivations to Examine", body: "Before leading others, a minister must ruthlessly examine their own motivations. Ask yourself honestly: Am I drawn to ministry because of a genuine calling, the approval of others, or the identity it provides? None of these are binary — most leaders carry a mixture. But the proportion matters. Leadership rooted in approval-seeking becomes controlling. Leadership rooted in identity-building becomes self-promoting. Only leadership rooted in calling can sustain the long seasons of obscurity and difficulty that ministry inevitably brings." },
        { heading: "Practical Reflection", body: "This week, perform one act of service for someone in your community that no one will ever know about. Observe what rises in you — pride, peace, resistance, or joy. What you feel reveals what you believe about leadership." },
      ],
    },
    {
      id: 2, phase: 1, order: 2,
      title: "Biblical Vision Casting",
      subtitle: "Leading People Toward a God-Given Future",
      type: "video", duration: "18 min watch",
      skills: { vision: 22, communication: 10 },
      category: "Vision", categoryColor: "#6eb5ff",
      excerpt: "How to articulate a compelling vision that is not your own ambition dressed in spiritual language.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      content: [
        { heading: "Vision vs. Ambition", body: "Many ministry leaders confuse personal ambition with divine vision. Ambition says: 'I want to build something great.' Vision says: 'God wants to restore something broken, and I get to participate.' The difference determines everything — your resilience under opposition, your response to failure, and your willingness to hand the work to someone else when the season calls for it." },
        { heading: "The Habakkuk Principle", body: "Habakkuk 2:2 says: 'Write the vision; make it plain on tablets, so he may run who reads it.' Biblical vision has three qualities: it is written (specific, not vague), it is plain (accessible to ordinary people), and it invites movement — people should be able to run with it, not merely admire it." },
      ],
    },
    {
      id: 3, phase: 1, order: 3,
      title: "Pastoral Communication",
      subtitle: "Speaking Truth With Grace and Clarity",
      type: "article", duration: "15 min read",
      skills: { communication: 20, wisdom: 10 },
      category: "Communication", categoryColor: "#7defa8",
      excerpt: "The art of speaking in a way that opens hearts rather than winning arguments.",
      content: [
        { heading: "Words That Open and Close", body: "Every conversation a pastor has either opens or closes something in the person across from them. It opens trust, possibility, and the willingness to change — or it closes it. The goal of pastoral communication is not to convey information accurately. It is to create conditions in which the Holy Spirit can work. That requires a different set of skills than preaching well." },
        { heading: "The Listening Posture", body: "James 1:19 instructs us to be 'quick to listen, slow to speak, and slow to become angry.' This is not just a virtue — it is a communication strategy. People do not receive counsel from those who haven't first shown they understand the problem. Before you speak a word of direction, ask three questions. Let the person feel deeply heard. Then speak." },
        { heading: "Delivering Hard Truth", body: "Paul writes of 'speaking the truth in love' (Ephesians 4:15) — a phrase so often quoted that its radical difficulty is obscured. Hard truth without love is brutality. Love without truth is flattery. The pastoral skill is holding both simultaneously: being specific enough to be honest, and warm enough that the truth lands as care rather than condemnation." },
      ],
    },
    {
      id: 4, phase: 2, order: 4,
      title: "Leading Through Crisis",
      subtitle: "Anchored When the Storm Arrives",
      type: "video", duration: "22 min watch",
      skills: { resilience: 25, wisdom: 12, vision: 8 },
      category: "Resilience", categoryColor: "#ff8c69",
      excerpt: "What to do in the first 72 hours of a crisis, and how to emerge with trust intact.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      content: [
        { heading: "The Anatomy of a Crisis", body: "Every ministry will face crisis — a moral failure, a community tragedy, a financial collapse, or a painful division. The question is not whether, but when. And in those moments, the congregation watches the leader with one question: Do they actually believe what they preach? Your calm does not come from knowing what to do. It comes from knowing who holds the outcome." },
      ],
    },
    {
      id: 5, phase: 2, order: 5,
      title: "Building a Ministry Team",
      subtitle: "Raising Leaders Around You",
      type: "article", duration: "14 min read",
      skills: { discipleship: 22, vision: 10, servanthood: 8 },
      category: "Team", categoryColor: "#d97aff",
      excerpt: "Why the lone-ranger pastor is a liability, and how to build a team that multiplies your impact.",
      content: [
        { heading: "Moses and the Weight of Alone", body: "In Exodus 18, Moses's father-in-law Jethro observes Moses judging the people from morning to evening — alone. His verdict is stark: 'What you are doing is not good. You will surely wear out.' Every leader who refuses to build a team is secretly believing that no one else can do it as well. But Jethro doesn't question Moses's capability — he questions his sustainability. You were not called to carry everything. You were called to build something that outlasts you." },
        { heading: "The Four Roles Every Team Needs", body: "Every healthy ministry team needs a Visionary (sees the future clearly), an Executor (turns vision into action), a Shepherd (guards the culture and cares for people), and a Challenger (asks the uncomfortable questions no one else will). If you only hire people who think like you, you will move fast in one direction — and miss everything on either side." },
      ],
    },
    {
      id: 6, phase: 2, order: 6,
      title: "Spiritual Disciplines for Leaders",
      subtitle: "Filling Before You Pour",
      type: "article", duration: "10 min read",
      skills: { wisdom: 20, resilience: 12, discipleship: 10 },
      category: "Formation", categoryColor: "#5bc4f5",
      excerpt: "The practices that keep a minister's inner life rich — not for performance, but for survival.",
      content: [
        { heading: "The Hidden Danger of Public Ministry", body: "Public ministry creates a unique spiritual hazard: you can serve God professionally while drifting from God personally. The preacher prepares sermons without sitting with scripture. The pastor counsels others through grief while avoiding their own. The worship leader creates atmosphere for encounter while remaining unmoved. This is not hypocrisy — it is the invisible cost of ministering without replenishing." },
        { heading: "Three Non-Negotiable Practices", body: "First, solitude and silence — not prayer, just quiet. The ability to be alone with God without an agenda is the foundation of everything else. Second, sabbath — a genuine 24-hour cessation from ministry work, every week. Not a day off to catch up on emails, but a day to remember that the church belongs to God, not you. Third, honest community — at least one relationship where you are not the pastor, but simply a person who needs help." },
      ],
    },
    {
      id: 7, phase: 3, order: 7,
      title: "Conflict Resolution in the Church",
      subtitle: "Peace That Doesn't Avoid Hard Conversations",
      type: "video", duration: "20 min watch",
      skills: { communication: 18, wisdom: 15, resilience: 8 },
      category: "Wisdom", categoryColor: "#d97aff",
      excerpt: "A step-by-step framework for navigating interpersonal conflict without losing relationships or integrity.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      content: [
        { heading: "The Cost of Conflict Avoidance", body: "Most ministry conflict doesn't explode — it festers. A quiet grievance becomes a faction. An unaddressed wound becomes a departure. Leaders who avoid conflict in the name of keeping peace create pressure cookers. The most loving thing you can do with tension is name it clearly and early." },
      ],
    },
    {
      id: 8, phase: 3, order: 8,
      title: "Financial Stewardship in Ministry",
      subtitle: "Honouring God With the Numbers",
      type: "article", duration: "13 min read",
      skills: { wisdom: 18, vision: 12 },
      category: "Stewardship", categoryColor: "#c49a3c",
      excerpt: "How to build financial transparency that strengthens congregational trust.",
      content: [
        { heading: "Money and the Ministry's Witness", body: "Nothing erodes trust in a church community faster than financial opacity. And nothing builds it faster than clear, humble, generous accountability. The way a church handles money is a theological statement — it either confirms or contradicts everything preached from the platform. Leaders must therefore approach finances not as an administrative burden, but as an act of worship." },
        { heading: "The Three Accountability Pillars", body: "Every healthy ministry needs separation of duties (the person who approves spending should not also sign cheques), regular reporting (financial summaries shared with leadership at least quarterly), and independent oversight (someone outside staff who reviews the books annually). These are not bureaucratic constraints — they are protections for the leader's integrity." },
      ],
    },
    {
      id: 9, phase: 3, order: 9,
      title: "Mentoring & Discipleship",
      subtitle: "Reproducing What You Are",
      type: "video", duration: "16 min watch",
      skills: { discipleship: 25, servanthood: 10, communication: 8 },
      category: "Discipleship", categoryColor: "#5bc4f5",
      excerpt: "The difference between teaching someone what you know and forming who they become.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      content: [
        { heading: "Paul's Model: Life-on-Life", body: "Paul writes to the Thessalonians: 'We were delighted to share with you not only the gospel of God but our lives as well.' Discipleship is not a curriculum. It is proximity. The most transformative thing you can give a young leader is not your knowledge — it is access to your life: your decision-making process, your prayer life, your failures and how you recovered from them." },
      ],
    },
    {
      id: 10, phase: 3, order: 10,
      title: "Community Outreach Strategy",
      subtitle: "Becoming Good News Before You Speak It",
      type: "article", duration: "11 min read",
      skills: { vision: 15, servanthood: 12, communication: 10 },
      category: "Mission", categoryColor: "#7defa8",
      excerpt: "How to design ministry that earns the right to be heard in your local community.",
      content: [
        { heading: "Presence Before Program", body: "Many churches launch outreach programs to reach their community before they have established a presence in it. The result is transactional — we show up when we have something to offer and disappear when the event is over. Effective outreach begins years before any program: by showing up in school PTAs, local councils, neighbourhood associations, and crisis response — with no agenda except genuine care." },
        { heading: "Mapping Your Community's Gaps", body: "Every neighbourhood has visible gaps between what exists and what is needed. A simple listening exercise — 20 one-on-one conversations with local residents, business owners, and council workers — will reveal the most acute needs. Ministry strategy should be built from those conversations, not from a template borrowed from another church in another city." },
      ],
    },
  ];

  for (const mod of modules) {
    await prisma.module.upsert({
      where: { id: mod.id },
      create: mod,
      update: mod,
    });
  }

  console.log(`✔ Seeded ${modules.length} modules.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
