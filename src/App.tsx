import { useState } from "react";

type Link = {
  href: string;
  label: string;
  type: "contact" | "directory";
  location: string;
};

const cvPath = "/Ahmed_Dahmani_CV.pdf";

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

function App() {
  const [isCvOpen, setIsCvOpen] = useState(false);
  const toggleCv = () => setIsCvOpen((isOpen) => !isOpen);

  return (
    <main>
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
                aria-expanded={isCvOpen}
                aria-controls="cv-preview"
                onClick={toggleCv}
              >
                cv.pdf
              </button>
            </td>
            <td>document</td>
            <td>
              <div className="cv-actions">
                <span className="cv-note">Preview opens here.</span>
                <button
                  className="link-button"
                  type="button"
                  aria-expanded={isCvOpen}
                  aria-controls="cv-preview"
                  onClick={toggleCv}
                >
                  Preview
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {isCvOpen && (
        <section id="cv-preview" className="cv-section" aria-label="CV preview">
          <header className="cv-header">
            <span>Preview: Ahmed_Dahmani_CV.pdf</span>
            <button
              className="link-button"
              type="button"
              onClick={() => setIsCvOpen(false)}
            >
              close
            </button>
          </header>
          <object className="cv-preview" data={cvPath} type="application/pdf">
            <p>
              PDF preview is not supported by this browser.{" "}
              <a href={cvPath} target="_blank" rel="noopener noreferrer">
                Open the CV in a new tab.
              </a>
            </p>
          </object>
        </section>
      )}
    </main>
  );
}

export default App;
