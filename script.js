// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".burger")
  const nav = document.querySelector(".nav-links")
  const navLinks = document.querySelectorAll(".nav-links li")
  const navOverlay = document.querySelector(".nav-overlay")

  function closeMenu() {
    if (nav) nav.classList.remove("active")
    if (navOverlay) navOverlay.classList.remove("active")
    if (burger) burger.classList.remove("toggle")
    document.body.style.overflow = "auto"
  }

  if (burger) {
    burger.addEventListener("click", () => {
      nav.classList.toggle("active")
      navOverlay.classList.toggle("active")
      document.body.style.overflow = nav.classList.contains("active") ? "hidden" : "auto"

      navLinks.forEach((link, index) => {
        if (link.style.animation) {
          link.style.animation = ""
        } else {
          link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`
        }
      })

      burger.classList.toggle("toggle")
    })
  }

  if (navOverlay) {
    navOverlay.addEventListener("click", closeMenu)
  }

  // Handle navigation link clicks
  document.querySelectorAll(".nav-links a").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href")

      // Only handle internal anchor links (not external links or CV)
      if (href && href.startsWith("#") && href !== "#") {
        e.preventDefault()
        e.stopPropagation() // Prevent event bubbling

        const targetSection = document.querySelector(href)

        // Close mobile menu first
        if (nav && nav.classList.contains("active")) {
          closeMenu()

          setTimeout(() => {
            if (targetSection) {
              const navbarHeight = document.querySelector(".navbar")?.offsetHeight || 60
              const targetPosition = targetSection.offsetTop - navbarHeight

              window.scrollTo({
                top: targetPosition,
                behavior: "smooth",
              })
            }
          }, 400) // Increased from 350ms to 400ms
        } else {
          // Desktop - scroll immediately
          if (targetSection) {
            const navbarHeight = document.querySelector(".navbar")?.offsetHeight || 60
            const targetPosition = targetSection.offsetTop - navbarHeight

            window.scrollTo({
              top: targetPosition,
              behavior: "smooth",
            })
          }
        }
      }
    })
  })
})

const contactForm = document.getElementById("contact-form")

contactForm.addEventListener("submit", async function (e) {
  e.preventDefault()

  const submitBtn = this.querySelector(".submit-btn")
  const originalText = submitBtn.innerHTML

  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'
  submitBtn.disabled = true

  try {
    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const message = document.getElementById("message").value

    const response = await fetch("http://localhost:3000/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, message }),
    })

    const result = await response.json()

    if (result.success) {
      alert("Thank you for your message! I will get back to you soon.")
      contactForm.reset()
    } else {
      alert("Error: " + result.message)
    }
  } catch (error) {
    console.error("Form submission error:", error)
    alert("Failed to send message. Please check your connection and try again.")
  } finally {
    submitBtn.innerHTML = originalText
    submitBtn.disabled = false
  }
})

window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section")
  const navLinks = document.querySelectorAll(".nav-links a")

  let current = ""

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.clientHeight
    if (pageYOffset >= sectionTop - 60) {
      current = section.getAttribute("id")
    }
  })

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href").slice(1) === current) {
      link.classList.add("active")
    }
  })
})

window.addEventListener("DOMContentLoaded", () => {
  const bgVideo = document.getElementById("bg-video")
  if (bgVideo) {
    bgVideo.addEventListener("loadedmetadata", () => {
      if (bgVideo.duration && !isNaN(bgVideo.duration)) {
        bgVideo.currentTime = bgVideo.duration / 2
      }
    })
  }

  // Back to top functionality
  const backToTopBtn = document.querySelector(".back-to-top")
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault()
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    })
  }

  const skillSection = document.getElementById("skills")
  const fills = document.querySelectorAll(".progress-fill")
  if (skillSection && fills.length) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fills.forEach((el) => {
              const pct = Number.parseInt(el.getAttribute("data-percent") || "0", 10)
              el.style.width = pct + "%"
            })
            obs.disconnect()
          }
        })
      },
      { threshold: 0.25 },
    )
    observer.observe(skillSection)
  }
})

document.body.classList.add("light-mode")
;(() => {
  const canvas = document.getElementById("sparkle-canvas")
  if (!canvas) return
  const ctx = canvas.getContext("2d")
  let devicePixelRatioValue = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
  let width = 0,
    height = 0
  let particles = []
  let running = false
  let lastTime = 0

  function isLightMode() {
    return true
  }

  function getCssVar(name, fallback) {
    const styles = getComputedStyle(document.documentElement)
    const value = styles.getPropertyValue(name).trim()
    return value || fallback
  }

  function hexToRgb(hex) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!m) return { r: 255, g: 255, b: 255 }
    return { r: Number.parseInt(m[1], 16), g: Number.parseInt(m[2], 16), b: Number.parseInt(m[3], 16) }
  }

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min
  }

  function pickAccentColor() {
    const c1 = hexToRgb(getCssVar("--accent", "#4ecdc4"))
    const c2 = hexToRgb(getCssVar("--accent2", "#45b7d1"))
    const t = Math.random()
    const r = Math.round(c1.r + (c2.r - c1.r) * t)
    const g = Math.round(c1.g + (c2.g - c1.g) * t)
    const b = Math.round(c1.b + (c2.b - c1.b) * t)
    return { r, g, b }
  }

  function pickSparkleColor() {
    if (isLightMode()) {
      return { r: 87, g: 166, b: 255 }
    }
    return { r: 255, g: 255, b: 255 }
  }

  function setCanvasSize() {
    width = window.innerWidth
    height = window.innerHeight
    devicePixelRatioValue = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    canvas.width = Math.floor(width * devicePixelRatioValue)
    canvas.height = Math.floor(height * devicePixelRatioValue)
    canvas.style.width = width + "px"
    canvas.style.height = height + "px"
    ctx.setTransform(devicePixelRatioValue, 0, 0, devicePixelRatioValue, 0, 0)
  }

  function computeParticleCount() {
    const area = width * height
    return Math.max(40, Math.min(140, Math.floor(area / 20000)))
  }

  function createParticles() {
    const count = computeParticleCount()
    particles = new Array(count).fill(0).map(() => {
      const color = pickSparkleColor()
      const baseAlpha = isLightMode() ? 0.9 : 0.4
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: randomBetween(-0.05, 0.05),
        vy: randomBetween(-0.05, 0.05),
        size: randomBetween(0.9, 2.0),
        twinkleSpeed: randomBetween(0.8, 0.9),
        twinklePhase: Math.random() * Math.PI * 2,
        alpha: baseAlpha,
        baseAlpha,
        color,
      }
    })
  }

  function clear() {
    ctx.clearRect(0, 0, width, height)
  }

  function drawParticle(p, t) {
    const twinkle = (Math.sin(t * p.twinkleSpeed + p.twinklePhase) + 1) * 0.5
    const a = p.baseAlpha * (0.6 + twinkle * 0.7)
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(" + p.color.r + "," + p.color.g + "," + p.color.b + "," + a + ")"
    ctx.shadowColor = "rgba(" + p.color.r + "," + p.color.g + "," + p.color.b + ",0.6)"
    ctx.shadowBlur = 8
    ctx.fill()
  }

  function updateParticle(p) {
    p.x += p.vx
    p.y += p.vy
    if (p.x < -4) p.x = width + 4
    if (p.x > width + 4) p.x = -4
    if (p.y < -4) p.y = height + 4
    if (p.y > height + 4) p.y = -4
  }

  function loop(ts) {
    if (!running) return
    const t = ts ? ts / 1000 : lastTime + 0.016
    lastTime = t
    clear()
    ctx.globalCompositeOperation = "lighter"
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      drawParticle(p, t)
      updateParticle(p)
    }
    ctx.globalCompositeOperation = "source-over"
    requestAnimationFrame(loop)
  }

  function restart() {
    setCanvasSize()
    createParticles()
  }

  function onResize() {
    restart()
  }

  window.addEventListener("resize", onResize)

  function start() {
    if (running) return
    canvas.style.display = ""
    running = true
    restart()
    requestAnimationFrame(loop)
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", start)
  } else {
    start()
  }
})()
