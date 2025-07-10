// Theme Toggle Functionality
const toggleBtn = document.getElementById('theme-toggle-btn');
const toggleIcon = document.querySelector('.toggle-icon');
const body = document.body;

// Check for saved theme or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
body.classList.add(currentTheme + '-mode');
toggleIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

toggleBtn.addEventListener('click', () => {
    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        toggleIcon.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        toggleIcon.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
});

// Mobile menu toggle functionality
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('is-active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    mobileMenu.classList.remove('is-active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll to top functionality
function createScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top';
    scrollButton.style.display = 'none';
    document.body.appendChild(scrollButton);

    // Show/hide scroll button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollButton.style.display = 'block';
        } else {
            scrollButton.style.display = 'none';
        }
    });

    // Scroll to top when clicked
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Terminal functionality
class Terminal {
    constructor() {
        this.output = document.getElementById('terminal-output');
        this.input = document.getElementById('terminal-input');
        this.inputDisplay = document.getElementById('input-display');
        this.commandHistory = []; // Track command history
        this.commands = {
            whatnow: () => this.showHelp(),
            about: () => this.showAbout(),
            skills: () => this.showSkills(),
            projects: () => this.showProjects(),
            contact: () => this.showContact(),
            clear: () => this.clearTerminal(),
            cls: () => this.clearTerminal(), // Windows alternative for clear
            date: () => this.showDate(),
            whoami: () => this.showWhoAmI(),
            ls: () => this.listFiles(),
            cat: (args) => this.catFile(args),
            echo: (args) => this.echo(args),
            pwd: () => this.showPwd(),
            theme: () => this.toggleTheme(),
            social: () => this.showSocial(),
            resume: () => this.showResume(),
            jokes: () => this.tellJoke(),
            history: () => this.showHistory(),
            exit: () => this.exitTerminal(),
            version: () => this.showVersion(),
            views: () => this.showViews(),
            'reset-views': () => this.resetViews()
        };
        
        this.fileSystem = {
            'about.txt': 'CS student graduating in 2026. Passionate about building pain-relieving projects with MERN stack.',
            'skills.txt': 'JavaScript, React, Node.js, MongoDB, Express.js, HTML, CSS, Git, Linux',
            'dreams.txt': 'Building baseerah - a dream logging application',
            'goals.txt': 'Create projects that make people\'s lives easier and more efficient'
        };
        
        this.jokes = [
            "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
            "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡",
            "Why do Java developers wear glasses? Because they don't see sharp! 👓",
            "What's a programmer's favorite hangout place? Foo Bar! 🍺",
            "Why did the programmer quit his job? He didn't get arrays! 📊"
        ];
        
        this.commandHistory = []; // Initialize command history array
        
        this.init();
    }
    
    init() {
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.processCommand();
            }
        });

        // Update display as user types
        this.input.addEventListener('input', (e) => {
            this.updateInputDisplay();
        });

        // Focus input when clicking on terminal
        document.querySelector('.terminal-body').addEventListener('click', () => {
            this.input.focus();
        });

        // Initial display update
        this.updateInputDisplay();
        
        // Ensure cursor starts at position 0
        setTimeout(() => {
            this.updateInputDisplay();
        }, 100);
    }

    updateInputDisplay() {
        if (this.inputDisplay) {
            this.inputDisplay.textContent = this.input.value;
            
            // Position cursor after the text
            const cursor = document.querySelector('.cursor');
            if (cursor) {
                if (this.input.value.length === 0) {
                    // When input is empty, position cursor at the beginning
                    cursor.style.left = '0px';
                } else {
                    try {
                        // Use canvas to measure text width accurately
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        const computedStyle = window.getComputedStyle(this.inputDisplay);
                        context.font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`;
                        const textWidth = context.measureText(this.input.value).width;
                        
                        // Position cursor right after the text
                        cursor.style.left = Math.ceil(textWidth) + 'px';
                    } catch (error) {
                        // Fallback: approximate width using character count
                        // Average character width in monospace font is about 0.6em
                        const charWidth = 0.6 * parseFloat(window.getComputedStyle(this.inputDisplay).fontSize);
                        const textWidth = this.input.value.length * charWidth;
                        cursor.style.left = Math.ceil(textWidth) + 'px';
                    }
                }
            }
        }
    }
    
    processCommand() {
        const command = this.input.value.trim();
        if (!command) return;
        
        // Add command to output
        this.addLine(`<span class="prompt">asnan@blogfolio:~$</span> <span class="command">${command}</span>`);
        
        // Add command to history
        this.commandHistory.push(command);
        
        // Parse command and arguments
        const [cmd, ...args] = command.split(' ');
        
        // Execute command
        if (this.commands[cmd.toLowerCase()]) {
            this.commands[cmd.toLowerCase()](args);
        } else {
            this.addLine(`<span class="error">Command not found: ${cmd}</span>`);
            this.addLine(`<span class="info">💡 Tip: Type 'whatnow' to see all available commands</span>`);
        }
        
        // Clear input and update display
        this.input.value = '';
        this.updateInputDisplay();
        this.scrollToBottom();
    }
    
    addLine(content, className = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.innerHTML = content;
        this.output.appendChild(line);
    }
    
    scrollToBottom() {
        const terminalBody = document.querySelector('.terminal-body');
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
    
    showHelp() {
        this.addLine(`<span class="info">🖥️  Available Commands:</span>`);
        this.addLine(`<span class="output">┌─────────────────────────────────────────────────────┐</span>`);
        this.addLine(`<span class="output">│  whatnow    - Show available commands              │</span>`);
        this.addLine(`<span class="output">│  about      - About me                             │</span>`);
        this.addLine(`<span class="output">│  skills     - My technical skills                  │</span>`);
        this.addLine(`<span class="output">│  projects   - Current projects                     │</span>`);
        this.addLine(`<span class="output">│  contact    - Contact information                  │</span>`);
        this.addLine(`<span class="output">│  social     - Social media links                   │</span>`);
        this.addLine(`<span class="output">│  resume     - Download resume info                 │</span>`);
        this.addLine(`<span class="output">│  clear/cls  - Clear terminal screen                │</span>`);
        this.addLine(`<span class="output">│  date       - Show current date                    │</span>`);
        this.addLine(`<span class="output">│  whoami     - Display current user                 │</span>`);
        this.addLine(`<span class="output">│  ls         - List files                           │</span>`);
        this.addLine(`<span class="output">│  cat [file] - Display file content                 │</span>`);
        this.addLine(`<span class="output">│  echo [text]- Display text                         │</span>`);
        this.addLine(`<span class="output">│  pwd        - Print working directory              │</span>`);
        this.addLine(`<span class="output">│  theme      - Toggle dark/light mode               │</span>`);
        this.addLine(`<span class="output">│  jokes      - Tell a programming joke              │</span>`);
        this.addLine(`<span class="output">│  history    - Show command history                 │</span>`);
        this.addLine(`<span class="output">│  views      - Show unique visitor analytics        │</span>`);
        this.addLine(`<span class="output">│  reset-views- Reset visitor counter (dev only)    │</span>`);
        this.addLine(`<span class="output">│  version    - Show terminal version                │</span>`);
        this.addLine(`<span class="output">│  exit       - Exit terminal session                │</span>`);
        this.addLine(`<span class="output">└─────────────────────────────────────────────────────┘</span>`);
        this.addLine(`<span class="info">💡 Tip: Use 'ls' to see available files, then 'cat filename' to read them!</span>`);
    }
    
    showAbout() {
        this.addLine(`<span class="info">About Asnan:</span>`);
        this.addLine(`<span class="output">👋 Hi! I'm Asnan, a Computer Science student graduating in 2026.</span>`);
        this.addLine(`<span class="output">🎯 Goal: Building pain-relieving projects using MERN stack.</span>`);
        this.addLine(`<span class="output">💭 Currently working on Baseerah - a dream logging app.</span>`);
        this.addLine(`<span class="output">🌱 Always learning and exploring new technologies!</span>`);
    }
    
    showSkills() {
        this.addLine(`<span class="info">Technical Skills:</span>`);
        this.addLine(`<span class="output">Frontend: JavaScript, React, HTML5, CSS3</span>`);
        this.addLine(`<span class="output">Backend: Node.js, Express.js, MongoDB</span>`);
        this.addLine(`<span class="output">Tools: Git, Linux, VS Code</span>`);
        this.addLine(`<span class="output">Learning: MERN Stack, Web Development</span>`);
    }
    
    showProjects() {
        this.addLine(`<span class="info">Current Projects:</span>`);
        this.addLine(`<span class="output">🌟 Baseerah - Dream logging application</span>`);
        this.addLine(`<span class="output">📖 This Blogfolio - Personal website with terminal interface</span>`);
        this.addLine(`<span class="output">🎓 MERN Stack Learning Projects</span>`);
    }
    
    showContact() {
        this.addLine(`<span class="info">Contact Information:</span>`);
        this.addLine(`<span class="output">📧 Email: asnan0130@gmail.com</span>`);
        this.addLine(`<span class="output">🐦 Twitter: @l0n3d3v</span>`);
        this.addLine(`<span class="output">💼 LinkedIn: linkedin.com/in/l0n3d3v</span>`);
    }
    
    showSocial() {
        this.addLine(`<span class="info">Social Media:</span>`);
        this.addLine(`<span class="output">🐦 Twitter/X: <a href="https://x.com/l0n3d3v" target="_blank">@l0n3d3v</a></span>`);
        this.addLine(`<span class="output">💼 LinkedIn: <a href="https://www.linkedin.com/in/l0n3d3v" target="_blank">asnan</a></span>`);
    }
    
    showResume() {
        this.addLine(`<span class="info">Resume:</span>`);
        this.addLine(`<span class="output">📄 Resume will be available soon!</span>`);
        this.addLine(`<span class="output">For now, you can contact me directly for more details.</span>`);
    }
    
    clearTerminal() {
        // Store a reference to the welcome message
        const welcomeMessage = `
            <div class="terminal-line">
                <span class="prompt">asnan@blogfolio:~$</span> <span class="command">Terminal initialized</span>
            </div>
            <div class="terminal-line">
                <span class="output">Welcome to Asnan's interactive terminal! 🖥️</span>
            </div>
            <div class="terminal-line">
                <span class="output">Type 'whatnow' to see available commands</span>
            </div>
        `;
        
        // Clear the output completely
        this.output.innerHTML = welcomeMessage;
        
        // Add a confirmation message
        this.addLine(`<span class="info">✨ Terminal cleared successfully!</span>`);
        
        // Scroll to bottom
        this.scrollToBottom();
    }
    
    showDate() {
        const now = new Date();
        this.addLine(`<span class="output">${now.toString()}</span>`);
    }
    
    showWhoAmI() {
        this.addLine(`<span class="output">asnan</span>`);
    }
    
    listFiles() {
        this.addLine(`<span class="info">Files in current directory:</span>`);
        Object.keys(this.fileSystem).forEach(file => {
            this.addLine(`<span class="output">${file}</span>`);
        });
    }
    
    catFile(args) {
        if (!args || args.length === 0) {
            this.addLine(`<span class="error">Usage: cat [filename]</span>`);
            return;
        }
        
        const filename = args[0];
        if (this.fileSystem[filename]) {
            this.addLine(`<span class="output">${this.fileSystem[filename]}</span>`);
        } else {
            this.addLine(`<span class="error">cat: ${filename}: No such file or directory</span>`);
        }
    }
    
    echo(args) {
        if (!args || args.length === 0) {
            this.addLine(`<span class="output"></span>`);
        } else {
            this.addLine(`<span class="output">${args.join(' ')}</span>`);
        }
    }
    
    showPwd() {
        this.addLine(`<span class="output">/home/asnan/blogfolio</span>`);
    }
    
    toggleTheme() {
        const themeToggleBtn = document.getElementById('theme-toggle-btn');
        if (themeToggleBtn) {
            themeToggleBtn.click();
            this.addLine(`<span class="info">Theme toggled!</span>`);
        } else {
            this.addLine(`<span class="error">Theme toggle not available</span>`);
        }
    }
    
    tellJoke() {
        const joke = this.jokes[Math.floor(Math.random() * this.jokes.length)];
        this.addLine(`<span class="warning">${joke}</span>`);
    }
    
    showHistory() {
        this.addLine(`<span class="info">📜 Command History:</span>`);
        if (this.commandHistory && this.commandHistory.length > 0) {
            this.commandHistory.slice(-10).forEach((cmd, index) => {
                this.addLine(`<span class="output">${index + 1}. ${cmd}</span>`);
            });
        } else {
            this.addLine(`<span class="output">No command history available yet.</span>`);
        }
    }
    
    exitTerminal() {
        this.addLine(`<span class="info">👋 Thanks for visiting! You can close this tab or continue exploring.</span>`);
        this.addLine(`<span class="output">Terminal session ended. Refresh to restart.</span>`);
        this.input.disabled = true;
    }
    
    showVersion() {
        this.addLine(`<span class="info">🚀 Terminal Version Information:</span>`);
        this.addLine(`<span class="output">Asnan's Blogfolio Terminal v1.0</span>`);
        this.addLine(`<span class="output">Built with: JavaScript, HTML5, CSS3</span>`);
        this.addLine(`<span class="output">Last Updated: July 2025</span>`);
        this.addLine(`<span class="output">Status: Fully Operational ✅</span>`);
    }

    showViews() {
        const viewCount = parseInt(localStorage.getItem('blogfolio-view-count') || '0');
        const visitors = JSON.parse(localStorage.getItem('blogfolio-visitors') || '[]');
        const currentSession = sessionStorage.getItem('blogfolio-current-session');
        const isNewVisitor = !currentSession;
        
        this.addLine(`<span class="info">📊 Website Analytics:</span>`);
        this.addLine(`<span class="output">👁️ Unique Visitors: ${formatViewCount(viewCount)}</span>`);
        this.addLine(`<span class="output">🔍 Total Visitor IDs: ${visitors.length}</span>`);
        this.addLine(`<span class="output">🎯 You are: ${isNewVisitor ? 'New Visitor' : 'Returning in this session'}</span>`);
        this.addLine(`<span class="output">📅 First visitor tracked: ${this.getFirstVisitDate()}</span>`);
        this.addLine(`<span class="info">💡 Counter only increments for unique visitors!</span>`);
    }

    resetViews() {
        localStorage.setItem('blogfolio-view-count', '0');
        localStorage.setItem('blogfolio-visitors', '[]');
        sessionStorage.removeItem('blogfolio-current-session');
        
        const viewCountElement = document.getElementById('view-count');
        if (viewCountElement) {
            viewCountElement.textContent = '0';
        }
        this.addLine(`<span class="warning">⚠️ Visitor counter and tracking data has been reset</span>`);
        this.addLine(`<span class="info">💡 Refresh the page to be counted as a new visitor</span>`);
    }

    getFirstVisitDate() {
        let firstVisit = localStorage.getItem('blogfolio-first-visit');
        if (!firstVisit) {
            firstVisit = new Date().toLocaleDateString();
            localStorage.setItem('blogfolio-first-visit', firstVisit);
        }
        return firstVisit;
    }
}

// Wait for DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme on page load
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(savedTheme + '-mode');
    
    const themeIcon = document.querySelector('.toggle-icon');
    if (themeIcon) {
        themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }

    // Initialize view counter
    initializeViewCounter();

    // Create scroll to top button
    createScrollToTop();

    // Initialize terminal if it exists
    if (document.getElementById('terminal-input')) {
        new Terminal();
    }
});

// View Counter functionality
function initializeViewCounter() {
    const viewCountElement = document.getElementById('view-count');
    if (!viewCountElement) return;

    // Generate a unique visitor ID based on browser characteristics
    const visitorId = generateVisitorId();
    
    // Check if this visitor has been here before
    const visitedVisitors = JSON.parse(localStorage.getItem('blogfolio-visitors') || '[]');
    const currentSession = sessionStorage.getItem('blogfolio-current-session');
    
    let shouldIncrement = false;
    
    // Only increment if this is a new visitor (not seen before) OR new session from different browser/device
    if (!visitedVisitors.includes(visitorId) && !currentSession) {
        // New unique visitor
        visitedVisitors.push(visitorId);
        localStorage.setItem('blogfolio-visitors', JSON.stringify(visitedVisitors));
        sessionStorage.setItem('blogfolio-current-session', visitorId);
        shouldIncrement = true;
    }
    
    // Get current view count
    let viewCount = parseInt(localStorage.getItem('blogfolio-view-count') || '0');
    
    if (shouldIncrement) {
        viewCount++;
        localStorage.setItem('blogfolio-view-count', viewCount.toString());
    }
    
    // Display the count with animation
    animateViewCount(viewCountElement, viewCount);
}

function generateVisitorId() {
    // Create a semi-unique ID based on browser characteristics
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Browser fingerprint', 2, 2);
    
    const fingerprint = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset(),
        canvas.toDataURL()
    ].join('|');
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36);
}

function animateViewCount(element, targetCount) {
    let currentCount = 0;
    const increment = Math.ceil(targetCount / 50); // Animate over ~50 steps
    const duration = 1000; // 1 second animation
    const stepTime = duration / (targetCount / increment);
    
    const timer = setInterval(() => {
        currentCount += increment;
        if (currentCount >= targetCount) {
            currentCount = targetCount;
            clearInterval(timer);
        }
        element.textContent = formatViewCount(currentCount);
    }, stepTime);
}

function formatViewCount(count) {
    if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K';
    }
    return count.toLocaleString();
}