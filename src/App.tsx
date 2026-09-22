import { useEffect, useLayoutEffect, useRef, useState } from "react";

type Link = {
  href: string;
  label: string;
  type: "contact" | "directory";
  location: string;
};

type StylePhase = "plain" | "opening" | "open" | "closing";
type CvPhase = "closed" | "opening" | "open" | "closing";

type WindowChromeProps = {
  title: string;
  name: string;
  isExpanded: boolean;
  onClose: () => void;
  onExpand: () => void;
};

const cvPath = `${import.meta.env.BASE_URL}Ahmed_Dahmani_CV.pdf`;
// Keep this preview image in sync when replacing the PDF.
const cvPreviewPath = `${import.meta.env.BASE_URL}Ahmed_Dahmani_CV_preview.png`;

const toggleStylePhase = (phase: StylePhase): StylePhase =>
  phase === "plain" || phase === "closing" ? "opening" : "closing";

const links: Link[] = [
  {
    href: "mailto:dahmeni.ahmed.portfolio@outlook.com",
    label: "email",
    type: "contact",
    location: "dahmeni.ahmed.portfolio@outlook.com",
  },
  {
    href: "https://github.com/dahmani01",
    label: "github/",
    type: "directory",
    location: "github.com/dahmani01",
  },
  {
    href: "https://www.linkedin.com/in/ahmed-dahmani01/",
    label: "linkedin/",
    type: "directory",
    location: "linkedin.com/in/ahmed-dahmani01",
  },
];

function WindowChrome({
  title,
  name,
  isExpanded,
  onClose,
  onExpand,
}: WindowChromeProps) {
  return (
    <div className="window-bar">
      <div
        className="window-controls"
        role="group"
        aria-label={`${name} controls`}
      >
        <button type="button" aria-label={`Close ${name}`} onClick={onClose} />
        <button type="button" aria-label={`Minimize ${name}`} onClick={onClose} />
        <button
          type="button"
          aria-label={`${isExpanded ? "Restore" : "Expand"} ${name}`}
          aria-pressed={isExpanded}
          onClick={onExpand}
        />
      </div>
      <span className="window-title">{title}</span>
    </div>
  );
}

function App() {
  const [cvPhase, setCvPhase] = useState<CvPhase>("closed");
  const [stylePhase, setStylePhase] = useState<StylePhase>("plain");
  const [isMaximized, setIsMaximized] = useState(false);
  const [isCvMaximized, setIsCvMaximized] = useState(false);
  const [isCvReady, setIsCvReady] = useState(false);
  const typedKeys = useRef("");
  const cvDialog = useRef<HTMLDialogElement>(null);
  const cvTrigger = useRef<HTMLButtonElement>(null);
  const openCv = (event: React.MouseEvent<HTMLButtonElement>) => {
    cvTrigger.current = event.currentTarget;
    setCvPhase("opening");
  };
  const closeCv = () => setCvPhase("closing");
  const toggleStyles = () => setStylePhase(toggleStylePhase);
  const closeWindow = () => setStylePhase("closing");

  const onWindowAnimationEnd = (event: React.AnimationEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;

    if (event.animationName === "window-open" && stylePhase === "opening") {
      setStylePhase("open");
    } else if (event.animationName === "window-close" && stylePhase === "closing") {
      setStylePhase("plain");
      setIsMaximized(false);
    }
  };

  const onCvAnimationEnd = (event: React.AnimationEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;

    if (event.animationName === "cv-window-in" && cvPhase === "opening") {
      setCvPhase("open");
      setIsCvReady(true);
    } else if (event.animationName === "cv-window-out" && cvPhase === "closing") {
      setCvPhase("closed");
      setIsCvMaximized(false);
      setIsCvReady(false);
    }
  };

  useLayoutEffect(() => {
    if (cvPhase !== "closed" && !cvDialog.current?.open) {
      cvDialog.current?.showModal();
    }
  }, [cvPhase]);

  useEffect(() => {
    if (cvPhase === "closed") cvTrigger.current?.focus();
  }, [cvPhase]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      const isEditing =
        target instanceof Element &&
        target.closest("input, textarea, select, [contenteditable]");

      if (
        cvDialog.current?.open ||
        event.repeat ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.key.length !== 1 ||
        isEditing
      ) {
        typedKeys.current = "";
        return;
      }

      typedKeys.current = (typedKeys.current + event.key.toLowerCase()).slice(-3);

      if (typedKeys.current === "css") {
        setStylePhase(toggleStylePhase);
        typedKeys.current = "";
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const isStyled = stylePhase !== "plain";
  const isCvOpen = cvPhase !== "closed";

  return (
    <div
      className={[
        "page",
        isStyled && "page--styled",
        stylePhase === "opening" && "page--opening",
        stylePhase === "closing" && "page--closing",
        isMaximized && "page--maximized",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <main onAnimationEnd={onWindowAnimationEnd}>
        <WindowChrome
          title="ahmed-dahmani / portfolio"
          name="portfolio window"
          isExpanded={isMaximized}
          onClose={closeWindow}
          onExpand={() => setIsMaximized((maximized) => !maximized)}
        />
        <div className="window-content">
          <h1>Ahmed Dahmani</h1>

          <p className="intro">
            Software engineer with 3+ years of experience building scalable .NET
            backends, React applications, and setting up CI/CD pipelines.
            <span className="scope">
              I'm comfortable taking a product from idea to production.
            </span>
          </p>

          <table>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Type</th>
                <th scope="col">Location</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => {
                const isExternal = link.href.startsWith("http");

                return (
                  <tr key={link.href}>
                    <td>
                      <a
                        href={link.href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                      >
                        {link.label}
                      </a>
                    </td>
                    <td>{link.type}</td>
                    <td>{link.location}</td>
                  </tr>
                );
              })}
              <tr>
                <td>
                  <button
                    className="link-button"
                    type="button"
                    aria-haspopup="dialog"
                    aria-expanded={isCvOpen}
                    aria-controls="cv-preview"
                    onClick={openCv}
                  >
                    cv.pdf
                  </button>
                </td>
                <td>document</td>
                <td>
                  <div className="cv-actions">
                    <span className="cv-note">Opens in a preview window.</span>
                    <button
                      className="link-button"
                      type="button"
                      aria-haspopup="dialog"
                      aria-expanded={isCvOpen}
                      aria-controls="cv-preview"
                      onClick={openCv}
                    >
                      Preview
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <button className="style-hint" type="button" onClick={toggleStyles}>
            Type or tap <kbd>css</kbd> to{" "}
            {isStyled ? "return to the plain view" : "restyle this page"}.
          </button>
        </div>
      </main>
      {cvPhase !== "closed" && (
        <dialog
          ref={cvDialog}
          id="cv-preview"
          className={`cv-dialog cv-dialog--${cvPhase}${isCvMaximized ? " cv-dialog--maximized" : ""}`}
          aria-label="CV preview"
          onAnimationEnd={onCvAnimationEnd}
          onCancel={(event) => {
            event.preventDefault();
            closeCv();
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeCv();
          }}
        >
          <WindowChrome
            title="Ahmed_Dahmani_CV.pdf"
            name="CV preview window"
            isExpanded={isCvMaximized}
            onClose={closeCv}
            onExpand={() => setIsCvMaximized((maximized) => !maximized)}
          />
          <div className="cv-dialog-body">
            {isCvReady ? (
              <div className="cv-preview-scroll">
                <img
                  className="cv-preview-image"
                  src={cvPreviewPath}
                  alt="Ahmed Dahmani CV, page 1 of 1"
                  width="990"
                  height="1400"
                  decoding="async"
                />
              </div>
            ) : (
              <div className="cv-loading">CV preview</div>
            )}
            <a
              className="cv-pdf-link"
              href={cvPath}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open PDF
            </a>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default App;
