import Image from "next/image";

export function PageBanner({ title, imageSrc }: { title: string, imageSrc: string }) {
  return (
    <div style={{ position: "relative", height: "260px", width: "100%", overflow: "hidden", paddingTop: "80px", marginBottom: "2rem" }}>
      <Image src={imageSrc} alt={title} fill style={{ objectFit: "cover" }} priority />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(12,12,13,0.9), rgba(12,12,13,0.5))" }}></div>
      <div className="container" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>
        <h1 className="title-display" style={{ color: "white", textShadow: "0 2px 10px rgba(0,0,0,0.5)", marginTop: "80px", fontSize: "3rem" }}>{title}</h1>
      </div>
    </div>
  );
}
