import { SiteFooter } from "@/components/SiteFooter";
import Image from "next/image";
import Link from "next/link";
import { srm } from "@/lib/navigation";
import { studentServices, type StudentService } from "./services";
import { StudentMotion } from "./StudentMotion";
import "@/app/home.css";
import "@/app/home-scenes.css";
import "./students.css";

function Arrow() { return <span aria-hidden="true">↗</span>; }
function Label({ number, children }: { number: string; children: React.ReactNode }) {
  return <div className="st-label">
    <span>{number} /</span>{children}<span aria-hidden="true">↘</span>
  </div>;
}
function Resource({ item, index }: { item: StudentService; index: number }) {
  return <Link className="st-resource" href={item.href} data-reveal>
    <span className="st-resource-index">{String(index + 1).padStart(2, "0")}</span>
    <span>
      <strong>{item.label}</strong>
      <small>{item.detail}</small>
    </span>
    <Arrow />
  </Link>;
}
export function StudentsPage() {
  const [academics, wifi, campus, score] = studentServices;
  const career = campus.links.find(link => link.label === "Career Centre")!;
  const academicLinks = [...academics.links.filter(link => link.label !== "Student gateway"), career];
  return <div className="s-home students-page">
    <StudentMotion />
    <section id="explore" className="st-academics st-section" aria-labelledby="academic-title">
      <div id="portals" className="st-academic-intro">
        <Label number="01">ACADEMIC ESSENTIALS</Label>
        <h1 id="academic-title" className="st-title" data-lines>
          <span>The everyday.</span>
          <span>Handled.</span>
        </h1>
        <p className="s-serif" data-reveal>Less searching.<br />More getting somewhere.</p>
        <p className="st-copy" data-reveal>Attendance, marks, fees and what comes next. Choose the portal for your programme and cohort.</p>
        <nav className="section-shortcuts" aria-label="Student shortcuts">
          <a href="#campus">Campus life ↓</a>
          <a href="#wifi">Wi-Fi and support ↓</a>
          <a href="#score">SCORE ↓</a>
        </nav>
        <div className="st-academic-image" data-image-reveal>
          <Image src="/home/campus.webp" alt="SRM campus buildings surrounded by landscaped grounds" fill sizes="(max-width: 850px) 85vw, 35vw" unoptimized />
          <span>YOUR DAY STARTS HERE ↗</span>
        </div>
      </div>
      <div className="st-academic-links">{academicLinks.map((item, i) => <Resource key={item.href} item={item} index={i} />)}<p className="st-portal-note">Not sure which portal is yours? <a href={academics.links[5].href}>Start at the student gateway <Arrow />
      </a>
      </p>
      </div>
    </section>
    <section id="campus" className="st-life" aria-labelledby="life-title">
      <div className="st-life-stage">
        <div className="st-life-media" data-parallax>
          <Image src="/home/racing.webp" alt="The SRM Camber Racing team gathered around their competition car" fill sizes="100vw" unoptimized />
        </div>
        <div className="st-life-heading">
          <Label number="02">LIFE BEYOND THE LECTURE</Label>
          <h2 id="life-title" className="st-title" data-lines>
            <span>Find your</span>
            <span>kind of</span>
            <span className="st-yellow">people.</span>
          </h2>
          <p className="s-serif" data-reveal>A club. A team. A late-night idea.<br />Make room for all of it.</p>
        </div>
        <div className="st-life-caption">
          <span>BUILD TOGETHER. GO FURTHER.</span>
          <span>TEAM CAMBER RACING / SRMIST</span>
        </div>
      </div>
      <div className="st-life-resources">
        <p className="st-life-note s-serif" data-reveal>There’s a whole<br />campus behind you.</p>
        <div>{campus.links.filter(link => link !== career).map((item, i) => <Resource item={item} index={i} key={item.href} />)}</div>
      </div>
    </section>
    <section id="wifi" className="st-connect st-section s-lines" aria-labelledby="wifi-title">
      <Label number="03">CAMPUS CONNECTIVITY</Label>
      <div className="st-connect-heading">
        <h2 id="wifi-title" className="st-title" data-lines>
          <span>Stay in</span>
          <span>the loop<span className="st-yellow">.</span>
          </span>
        </h2>
        <div>
          <span className="st-signal" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <p className="s-serif" data-reveal>Good connections.<br />On campus. Online.</p>
          <p className="st-copy">Join the campus network first. Then open the sign-in page for your location. Need a hand? IT support is right here.</p>
        </div>
      </div>
      <div className="st-network-cards">{wifi.links.map((item, i) => <a href={item.href} key={item.href} className="st-network-card" data-reveal>
        <span className="st-network-top">0{i + 1}<Arrow />
        </span>
        <span className="st-network-icon" aria-hidden="true">{["⌁", "⌂", "+", "↻"][i]}</span>
        <h3>{["Academic block Wi-Fi", "Hostel Wi-Fi", "IT service desk", "NetID password reset"][i]}</h3>
        <p>{item.detail}</p>
        <span className="st-network-link">{item.label}<Arrow />
        </span>
      </a>)}</div>
    </section>
    <section id="score" className="st-score st-section" aria-labelledby="score-title">
      <Label number="04">STUDENT-BUILT. STILL TAKING SHAPE.</Label>
      <div className="st-score-grid">
        <div className="st-score-art" data-image-reveal>
          <span className="st-score-orbit" aria-hidden="true" />
          <span className="st-score-word" aria-hidden="true">SCORE<span>↗</span>
          </span>
          <div className="st-score-stamp">A FRESH TAKE ON SCOPE<br />
            <span>STUDENT PROJECT / IN DEVELOPMENT</span>
          </div>
        </div>
        <div className="st-score-copy">
          <span className="st-status">
            <i />{score.status}</span>
          <h2 id="score-title" className="st-title" aria-label="SCORE. Built by us. For what’s next." data-lines>
            <span>Built by us.</span>
            <span>For what’s</span>
            <span>next.</span>
          </h2>
          <p className="s-serif" data-reveal>A fresh take on SCOPE.</p>
          <p className="st-copy">{score.description}</p>
          <p className="st-copy">SCORE isn’t available yet. For now, use the official portals for your academic records and student services.</p>
          <div className="st-score-links">{score.links.map(item => <a key={item.href} href={item.href}>{item.label}<Arrow />
          </a>)}</div>
        </div>
      </div>
    </section>
    <section className="st-next st-section" aria-labelledby="next-title">
      <Label number="05">A LITTLE DIRECTION</Label>
      <h2 id="next-title" className="st-title" data-lines>
        <span>Your next chapter.</span>
        <span>Starts here <span aria-hidden="true">↗</span>
        </span>
      </h2>
      <div>
        <p className="s-serif">A new interest. A familiar face.<br />Somewhere to turn.</p>
        <Link className="yellow-action s-button" href="/campus">Explore campus life <Arrow />
        </Link>
        <a className="st-text-link" href={srm + "/contact-us/"}>Talk to SRM <Arrow />
        </a>
      </div>
    </section>
    <SiteFooter />
  </div>;
}
