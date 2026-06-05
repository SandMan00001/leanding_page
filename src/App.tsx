import { useState } from 'react'
import awsLogo from './assets/aws.svg'
import k8sLogo from './assets/kubernetes.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [deployStep, setDeployStep] = useState(0)

  const steps = [
    "Ready to Deploy Cluster",
    "Initializing Terraform Providers...",
    "Provisioning AWS VPC & Subnets...",
    "Provisioning EKS Cluster & NodeGroups...",
    "Installing ArgoCD Helm Chart...",
    "Deploying App Manifests...",
    "Deployment Completed! Status: HEALTHY 🟢"
  ]

  const handleDeploy = () => {
    setDeployStep((prev) => (prev + 1) % steps.length)
  }

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="Cloud Base Platform" />
          <img src={k8sLogo} className="framework" alt="Kubernetes logo" />
          <img src={awsLogo} className="vite" alt="AWS logo" />
        </div>
        <div>
          <h1>Gabriele Saija</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--accent)', fontWeight: 600, marginTop: '-15px', marginBottom: '20px' }}>
            DevOps & Cloud Automation Engineer
          </p>
          <p style={{ maxWidth: '600px', margin: '0 auto 15px', lineHeight: '1.6' }}>
            Specializzato nella progettazione e orchestrazione di infrastrutture Cloud Native. Co-fondatore di FounDreams e autore di soluzioni di automazione multi-cloud basate su Terraform, Kubernetes (EKS/AKS), CI/CD con ArgoCD e strumenti CLI in Python.
          </p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            className="counter"
            onClick={handleDeploy}
            style={{ fontWeight: 'bold' }}
          >
            {steps[deployStep]}
          </button>
          {deployStep > 0 && (
            <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>
              Click to advance simulation ({deployStep}/{steps.length - 1})
            </p>
          )}
        </div>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Tesi & Architettura Cloud</h2>
          <p style={{ marginBottom: '15px' }}>
            Automazione di cluster EKS su AWS e AKS su Azure, con migrazione database PostgreSQL e storage a oggetti su S3/Blob Azure.
          </p>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
            <li>
              <a href="https://github.com/gabrielesaija" target="_blank" rel="noopener noreferrer">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                Repository Tesi
              </a>
            </li>
            <li>
              <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
                🛠️ Terraform Modules: VPC, IAM, EKS, RDS, Helm Providers
              </span>
            </li>
            <li>
              <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
                ⚓ ArgoCD & Kubernetes: GitOps Manifests, PV/PVC Storage
              </span>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Contatti & Community</h2>
          <p style={{ marginBottom: '15px' }}>
            Co-fondatore di FounDreams. Disponibile per consulenze cloud, automazione e design di architetture di deployment.
          </p>
          <ul>
            <li>
              <a href="mailto:gabriele.saija@foundreams.it">
                📩 Email
              </a>
            </li>
            <li>
              <a href="https://github.com/gabrielesaija" target="_blank" rel="noopener noreferrer">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://foundreams.it" target="_blank" rel="noopener noreferrer">
                🌐 FounDreams
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
