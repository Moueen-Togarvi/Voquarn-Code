"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Sparkles, ArrowRight, Briefcase, MapPin, DollarSign, Clock, Send, Search, X, Paperclip, Upload, Loader2, Sparkle, Link as LinkIcon, Github } from "lucide-react";

const TARGET_WHATSAPP = "923241940988";

const openRoles = [
  {
    title: "Senior Next.js & AI Engineer",
    department: "Engineering",
    location: "Remote / Lahore",
    type: "Full-time",
    salary: "$80k - $120k",
    description: "Lead the architectural development of high-performance Next.js web applications and autonomous AI agent workflows for our global enterprise clients.",
    tags: ["Next.js 15", "React", "TypeScript", "Python", "AI LLMs"]
  },
  {
    title: "UI/UX Design Director",
    department: "Design",
    location: "Remote / Lahore",
    type: "Full-time",
    salary: "$70k - $100k",
    description: "Shape the visual direction, design systems, and conversion-optimized user experiences across all Voquarn Code products and marketing surfaces.",
    tags: ["Figma", "Design Systems", "Prototyping", "Tailwind CSS"]
  },
  {
    title: "Growth & Technical SEO Lead",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    salary: "$60k - $90k",
    description: "Drive organic acquisition strategies, technical site audits, schema architectures, and high-intent funnel optimizations for fast-growing brands.",
    tags: ["Technical SEO", "Ahrefs", "Google Analytics", "Conversion Rate"]
  },
  {
    title: "Full Stack Supabase Architect",
    department: "Engineering",
    location: "Remote",
    type: "Contract / Full-time",
    salary: "$75k - $110k",
    description: "Design secure multi-tenant database schemas, row-level security policies, and real-time backend integrations for our custom SaaS platforms.",
    tags: ["Supabase", "PostgreSQL", "Node.js", "Edge Functions"]
  }
];

const perks = [
  { title: "Work Anywhere", description: "Complete remote freedom or join us in our modern Lahore hub." },
  { title: "Competitive Compensation", description: "Top-tier salary packages pegged to USD value with performance bonuses." },
  { title: "Latest Hardware", description: "M3 Max MacBooks and premium 4K displays provided to all core leads." },
  { title: "Zero Bureaucracy", description: "No micromanagement or useless daily standups. We judge purely on output." }
];

export default function CareersPage() {
  const departments = ["All", ...Array.from(new Set(openRoles.map((r) => r.department)))];
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Form state for application modal
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMsg, setSubmitMsg] = useState("");

  const filtered = openRoles.filter((role) => {
    const matchesTag = activeTag === "All" || role.department === activeTag;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      role.title.toLowerCase().includes(q) ||
      role.department.toLowerCase().includes(q) ||
      role.tags.some((t) => t.toLowerCase().includes(q));
    return matchesTag && matchesSearch;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setApplicantName("");
    setApplicantEmail("");
    setApplicantPhone("");
    setGithubUrl("");
    setPortfolioUrl("");
    setSelectedFile(null);
    setFileBase64("");
    setSubmitStatus("idle");
    setSubmitMsg("");
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail || !applicantPhone || !selectedFile) {
      alert("Name, email, mobile number, and CV file are required.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: applicantName,
          email: applicantEmail,
          phone: applicantPhone,
          role: selectedRole,
          github: githubUrl || undefined,
          website: portfolioUrl || undefined,
          fileData: fileBase64,
          fileName: selectedFile.name,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        setSubmitMsg(data.message || "Application successfully submitted!");

        // Format WhatsApp message to go directly to 03241940988
        const waMessage = `Hi Voquarn Code,\n\nI am applying for the *${selectedRole}* role.\n\n*Name:* ${applicantName}\n*Email:* ${applicantEmail}\n*WhatsApp/Phone:* ${applicantPhone}\n${githubUrl ? `*GitHub:* ${githubUrl}\n` : ""}${portfolioUrl ? `*Website:* ${portfolioUrl}\n` : ""}\nI have uploaded my CV file (${selectedFile.name}) which was emailed to you directly. Looking forward to discussing this!`;
        const waUrl = `https://wa.me/${TARGET_WHATSAPP}?text=${encodeURIComponent(waMessage)}`;
        
        setTimeout(() => {
          window.open(waUrl, "_blank");
          setSelectedRole(null);
          resetForm();
        }, 1500);
      } else {
        setSubmitStatus("error");
        setSubmitMsg(data.message || "Failed to submit application.");
      }
    } catch (err: any) {
      setSubmitStatus("error");
      setSubmitMsg("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="page-section mt-24 lg:mt-32 pt-40 lg:pt-56">
        <SectionHeading
          eyebrow="Careers"
          title="Build elite digital systems without corporate bureaucracy"
          description="We are looking for elite practitioners who take immense pride in their craft. No endless meetings, no office politics—just disciplined execution and high-impact shipping."
        />

        {/* Search Bar + Filter Tags */}
        <div className="mt-14 flex flex-col gap-5">
          {/* Search Input */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search roles, skills, departments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 rounded-full border border-neutral-200 bg-white text-sm text-neutral-800 placeholder-neutral-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff5400]/30 focus:border-[#ff5400]/60 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Department Filter Tags */}
          <div className="flex flex-wrap gap-2">
            {departments.map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setActiveTag(dept)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                  activeTag === dept
                    ? "bg-black text-white border-black shadow-md"
                    : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-black"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Perks Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((perk, index) => (
            <div key={perk.title} className="bg-white border border-neutral-200 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#ff5400]/10 flex items-center justify-center text-[#ff5400] mb-6 font-display font-black text-lg">
                0{index + 1}
              </div>
              <h4 className="font-display text-xl font-bold text-neutral-900 tracking-tight mb-2">{perk.title}</h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-medium">{perk.description}</p>
            </div>
          ))}
        </div>

        {/* Open Roles Section */}
        <div className="mt-24">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-6 mb-12">
            <div>
              <h3 className="font-display text-3xl font-black text-neutral-900 tracking-tight">Open Positions</h3>
              <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider font-bold">
                {filtered.length} {filtered.length === 1 ? "Role" : "Roles"} Available
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-[#ff5400]/10 border border-[#ff5400]/20 px-4 py-2 rounded-full text-[#ff5400] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Fast 48-Hour Interview Process
            </div>
          </div>

          <div className="space-y-6">
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-neutral-400">
                <Search className="w-10 h-10 mx-auto mb-4 opacity-40" />
                <p className="text-lg font-semibold">No roles found</p>
                <p className="text-sm mt-1">Try a different search or filter</p>
              </div>
            ) : filtered.map((role) => (
              <article 
                key={role.title} 
                className="bg-white border border-neutral-200 rounded-[2.5rem] p-8 sm:p-10 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-8"
              >
                <div className="space-y-4 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider">
                    <span className="text-[#ff5400] bg-[#ff5400]/10 px-3 py-1 rounded-full border border-[#ff5400]/20">{role.department}</span>
                    <span className="text-neutral-600 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-neutral-400" /> {role.location}</span>
                    <span className="text-neutral-600 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-neutral-400" /> {role.type}</span>
                    <span className="text-neutral-900 font-extrabold flex items-center gap-0.5 bg-neutral-100 px-3 py-1 rounded-full"><DollarSign className="w-3.5 h-3.5 text-[#ff5400]" /> {role.salary}</span>
                  </div>

                  <h4 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">{role.title}</h4>
                  <p className="text-sm text-neutral-600 leading-relaxed font-medium">{role.description}</p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {role.tags.map((t) => (
                      <span key={t} className="bg-neutral-100 text-neutral-700 text-[10px] font-bold px-3 py-1 rounded-full border border-neutral-200/80">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex-shrink-0 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-neutral-100">
                  <button
                    onClick={() => {
                      setSelectedRole(role.title);
                      resetForm();
                    }}
                    className="w-full lg:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-8 py-5 text-xs font-black uppercase tracking-widest text-white hover:bg-[#ff5400] shadow-md hover:shadow-xl transition-all hover:scale-105"
                  >
                    <Send className="w-4 h-4" /> <span>Apply for Role</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Spontaneous Application CTA */}
      <section className="page-section pt-16">
        <div className="rounded-[2.5rem] border border-neutral-900 bg-neutral-900 p-10 sm:p-14 shadow-2xl relative overflow-hidden text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#ff5400]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-xl relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff5400]/20 border border-[#ff5400]/30 text-white text-[10px] font-black uppercase tracking-widest mb-4">
              <Briefcase className="w-3.5 h-3.5 text-[#ff5400]" /> Spontaneous Application
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Don&apos;t see your exact role listed above?
            </h2>
            <p className="mt-4 text-neutral-300 text-sm sm:text-base leading-relaxed">
              We always make room for world-class talent. Send us your GitHub, Figma portfolio, or past project links directly. If your work is exceptional, we will create a role for you.
            </p>
          </div>
          <div className="relative z-10 w-full md:w-auto flex-shrink-0">
            <button
              onClick={() => {
                setSelectedRole("Spontaneous Application / General Talent");
                resetForm();
              }}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#ff5400] px-8 py-5 text-xs font-black uppercase tracking-widest text-white hover:bg-[#e04800] shadow-xl transition-all hover:scale-105"
            >
              <span>Send Portfolio Directly</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* --- PREMIUM APPLY MODAL --- */}
      {selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div 
            className="w-full max-w-[480px] bg-white border border-neutral-100 rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col p-6 sm:p-8 animate-slide-up"
            style={{ maxHeight: "calc(100vh - 32px)", overflowY: "auto" }}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedRole(null)}
              className="absolute right-6 top-6 w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors animate-pulse"
            >
              <X className="w-4 h-4 text-neutral-600" />
            </button>

            {/* Document / Sticky Note Visual Illustration (Highly-Polished) */}
            <div className="w-full flex justify-center py-4 mb-4 select-none">
              <div className="w-36 h-36 bg-neutral-50 rounded-2xl border border-neutral-200 relative flex items-center justify-center shadow-inner overflow-hidden">
                {/* Paper Lines */}
                <div className="absolute top-8 left-6 w-24 h-1 bg-neutral-200 rounded" />
                <div className="absolute top-12 left-6 w-16 h-1 bg-neutral-200 rounded" />
                <div className="absolute top-16 left-6 w-20 h-1 bg-neutral-200 rounded" />
                <div className="absolute top-20 left-6 w-24 h-1 bg-neutral-200 rounded" />
                
                {/* Yellow Sticky Note with Scribble */}
                <div className="absolute -top-1 -right-1 w-20 h-20 bg-[#fef08a] border border-[#fef08a] rotate-6 rounded-lg shadow-md p-2 flex flex-col gap-1 justify-center">
                  <div className="w-12 h-0.5 bg-[#ca8a04]/50 rounded" />
                  <div className="w-14 h-0.5 bg-[#ca8a04]/50 rounded" />
                  <div className="w-10 h-0.5 bg-[#ca8a04]/50 rounded" />
                </div>
                
                {/* Paperclip */}
                <div className="absolute top-1 right-12 text-neutral-400 rotate-12">
                  <Paperclip className="w-6 h-6 text-neutral-500 stroke-[2]" />
                </div>
              </div>
            </div>

            {/* Header Content */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold tracking-tight text-neutral-900 leading-tight px-4">
                Submit Your CV / Resume
              </h3>
              <p className="mt-2 text-xs text-neutral-500 leading-relaxed px-2">
                Ready to join our elite team? Upload your resume and links to apply instantly via Email and WhatsApp.
              </p>
              <div className="mt-3 inline-block px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200/80 text-[10px] font-bold text-neutral-700">
                Applying for: {selectedRole}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleApplySubmit} className="space-y-4">
              {/* Core Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1 pl-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-xs font-semibold placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#ff5400]/25 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1 pl-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-xs font-semibold placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#ff5400]/25 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1 pl-1">WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +92 324 1940988"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-xs font-semibold placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#ff5400]/25 transition-all"
                />
              </div>

              {/* Links - Optional */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1 pl-1 flex items-center gap-1">
                    <Github className="w-3 h-3 text-neutral-400" /> GitHub URL <span className="text-[8px] text-neutral-400 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-xs font-semibold placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#ff5400]/25 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1 pl-1 flex items-center gap-1">
                    <LinkIcon className="w-3 h-3 text-neutral-400" /> Website <span className="text-[8px] text-neutral-400 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://myportfolio.com"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-xs font-semibold placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#ff5400]/25 transition-all"
                  />
                </div>
              </div>

              {/* CV Uploader */}
              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1 pl-1">Upload CV / Resume *</label>
                <div className="border border-dashed border-neutral-200 rounded-2xl p-5 flex flex-col items-center justify-center bg-neutral-50 hover:bg-neutral-100/50 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    required
                    accept=".pdf,.docx,.doc"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-6 h-6 text-neutral-400 mb-2" />
                  <span className="text-xs font-bold text-neutral-800">
                    {selectedFile ? selectedFile.name : "Choose PDF / Word File"}
                  </span>
                  <span className="text-[9px] text-neutral-400 mt-1">Max file size: 5MB</span>
                </div>
              </div>

              {/* Response Messages */}
              {submitStatus !== "idle" && (
                <div className={`p-3 rounded-xl text-center text-xs font-semibold ${
                  submitStatus === "success" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                }`}>
                  {submitMsg}
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-100 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="w-1/2 py-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold tracking-wider transition-colors"
                >
                  Maybe later
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedFile}
                  className="w-1/2 py-3.5 rounded-xl bg-black hover:bg-neutral-900 text-white text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Applying...</span>
                    </>
                  ) : (
                    <>
                      <span>Apply Now</span>
                      <Sparkle className="w-3 h-3 fill-current text-yellow-400 animate-pulse" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
