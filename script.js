// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

// Smooth scrolling navigation
const menuItems = document.querySelectorAll('.menu a');

menuItems.forEach(item => {
  item.addEventListener('click', smoothScroll);
});

function smoothScroll(e) {
  e.preventDefault();
  const targetId = this.getAttribute('href');
  const targetPosition = document.querySelector(targetId).offsetTop - 80;
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
}

// Sticky header
const header = document.querySelector('header');
const heroSection = document.querySelector('.hero');

window.addEventListener('scroll', stickyHeader);

function stickyHeader() {
  if (window.pageYOffset > heroSection.offsetHeight - 100) {
    header.classList.add('sticky');
  } else {
    header.classList.remove('sticky');
  }
}

// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.menu');

hamburger.addEventListener('click', toggleMenu);

function toggleMenu() {
  hamburger.classList.toggle('active');
  menu.classList.toggle('active');
}

// Task game functionality
const gameBoard = document.querySelector('.game-board');
const taskContainer = document.querySelector('.task-container');
const scoreElement = document.querySelector('.score-value');
const startButton = document.querySelector('.start-button');
const stopButton = document.querySelector('.stop-button');
const resetButton = document.querySelector('.reset-button');
const slashSound = document.getElementById('slash-sound');
const backgroundMusic = document.getElementById('background-music');

let score = 0;
let gameInterval;
let tasks = [];
let maxTasks = 20;

const taskList = [
  { name: 'Write a press release' },
{ name: 'Design a logo' },
{ name: 'Develop a simple web app' },
{ name: 'Proofread a document' },
{ name: 'Create a social media post' },
{ name: 'Conduct market research' },
{ name: 'Translate a document' },
{ name: 'Transcribe an audio file' },
{ name: 'Analyze data in Excel' },
{ name: 'Write a product description' },
{ name: 'Create a PowerPoint presentation' },
{ name: 'Provide customer service' },
{ name: 'Manage a project' },
{ name: 'Tutor in math' },
{ name: 'Prepare a business plan' },
{ name: 'Conduct a photoshoot' },
{ name: 'Edit a video' },
{ name: 'Compose a song' },
{ name: 'Design a book cover' },
{ name: 'Develop a mobile app' },
{ name: 'Create an infographic' },
{ name: 'Write a movie script' },
{ name: 'Provide legal advice' },
{ name: 'Consult on interior design' },
{ name: 'Develop a marketing strategy' },
{ name: 'Conduct a usability test' },
{ name: 'Illustrate a childrens book' },
{ name: 'Organize a closet' },
{ name: 'Assemble furniture' },
{ name: 'Paint a room' },
{ name: 'Install a light fixture' },
{ name: 'Fix a leaky faucet' },
{ name: 'Mow the lawn' },
{ name: 'Clean the gutters' },
{ name: 'Wash the car' },
{ name: 'Grocery shopping' },
{ name: 'Prepare a meal' },
{ name: 'Walk the dog' },
{ name: 'Babysit the kids' },
{ name: 'Organize a party' },
{ name: 'Wait in a line' },
{ name: 'Pick up dry cleaning' },
{ name: 'Deliver a package' },
{ name: 'Set up a home theater system' },
{ name: 'Provide makeup services' },
{ name: 'Give a massage' },
{ name: 'Teach a yoga class' },
{ name: 'Coach a sports team' },
{ name: 'Provide photography services' },
{ name: 'DJ an event' },
{ name: 'Assist with event planning' },
{ name: 'Perform magic tricks at a party' },
{ name: 'Provide personal shopping services' },
{ name: 'Offer fashion advice' },
{ name: 'Conduct a home energy audit' },
{ name: 'Provide pet grooming services' },
{ name: 'Offer personal training sessions' },
{ name: 'Teach a cooking class' },
{ name: 'Provide gardening services' },
{ name: 'Offer language lessons' },
{ name: 'Conduct a photoshoot for a dating profile' },
{ name: 'Provide resume writing services' },
{ name: 'Offer career coaching' },
{ name: 'Teach a musical instrument' },
{ name: 'Provide swimming lessons' },
{ name: 'Offer home organization services' },
{ name: 'Provide car maintenance tutorials' },
{ name: 'Teach a self-defense class' },
{ name: 'Offer public speaking coaching' },
{ name: 'Provide knitting or crochet lessons' },
{ name: 'Offer calligraphy services' },
{ name: 'Provide a guided city tour' },
{ name: 'Teach a painting class' },
{ name: 'Offer personal chef services' },
{ name: 'Provide dance lessons' },
{ name: 'Offer meditation guidance' },
{ name: 'Teach a photography workshop' },
{ name: 'Provide comic book illustration' },
{ name: 'Offer tarot card reading' },
{ name: 'Provide home staging services' },
{ name: 'Offer voice acting services' },
{ name: 'Teach a creative writing workshop' },
{ name: 'Provide personal branding consultation' },
{ name: 'Offer speed reading lessons' },
{ name: 'Provide sign language interpretation' },
{ name: 'Offer pottery classes' },
{ name: 'Teach a juggling workshop' },
{ name: 'Provide soap making lessons' },
{ name: 'Offer woodworking classes' },
{ name: 'Provide a guided nature hike' },
{ name: 'Offer a beer brewing workshop' },
{ name: 'Teach a robotics class' },
{ name: 'Provide a guided stargazing session' },
{ name: 'Offer a glassblowing workshop' },
{ name: 'Teach a beatboxing class' },
{ name: 'Offer a wine tasting experience' },
{ name: 'Provide a guided meditation session' },
{ name: 'Teach a stand-up comedy workshop' },
{ name: 'Offer a pottery throwing class' },
{ name: 'Provide a guided foraging expedition' },
{ name: 'Teach a calligraphy workshop' },
{ name: 'Offer a cheese making class' },
{ name: 'Provide a guided birdwatching tour' },
{ name: 'Teach a beatmaking workshop' },
{ name: 'Offer a glassblowing class' },
{ name: 'Provide a guided mushroom hunting tour' },
{ name: 'Teach a screenwriting workshop' },
{ name: 'Offer a blacksmithing class' },
{ name: 'Provide a guided ghost tour' },
{ name: 'Teach a spoken word poetry workshop' },
{ name: 'Offer a beekeeping class' },
{ name: 'Provide a guided food tour' },
{ name: 'Teach a DJ mixing workshop' },
{ name: 'Offer a leatherworking class' },
{ name: 'Provide a guided architecture tour' },
{ name: 'Teach a stop-motion animation workshop' },
{ name: 'Offer a soapstone carving class' },
{ name: 'Provide a guided pub crawl' },
{ name: 'Teach a puppetry workshop' },
{ name: 'Offer a glass etching class' },
{ name: 'Provide a guided street art tour' },
{ name: 'Teach a podcasting workshop' },
{ name: 'Offer a candlemaking class' },
{ name: 'Provide a guided historical tour' },
{ name: 'Teach a ventriloquism workshop' },
{ name: 'Offer a metalworking class' },
{ name: 'Provide a guided ghost hunting expedition' },
{ name: 'Teach a magic trick workshop' },
{ name: 'Offer a paper marbling class' },
{ name: 'Provide a guided wine country tour' },
{ name: 'Teach a mime workshop' },
{ name: 'Offer a bookbinding class' },
{ name: 'Provide a guided paranormal investigation' },
{ name: 'Teach a yo-yo trick workshop' },
{ name: 'Offer a stained glass making class' },
{ name: 'Provide a guided graffiti art tour' },
{ name: 'Teach a juggling workshop' },
{ name: 'Offer a stone carving class' },
{ name: 'Provide a guided ghost ship tour' },
{ name: 'Teach a ventriloquism workshop' },
{ name: 'Offer a glassblowing class' },
{ name: 'Do my assignment'},
{ name: 'Do my Tax'},
{ name: 'Do my homework'},
{ name: 'Do my project'},
{ name: 'Do my research'},
{ name: 'Need a repair done in home'},
{ name: 'Stand in line for me'},
{ name: 'Pick up my groceries'},
{ name: 'Pick up my laundry'},
{ name: 'Pick up my dry cleaning'},
{ name: 'Pick up my prescription'},
{ name: 'Pick up my takeout'},
{ name: 'Pick up my mail'},
{ name: 'Pick up my package'},
{ name: 'BabySit my kids for a day'},
{ name:'Clean my house'},
{ name: 'Clean my apartment'},
{ name:'Organize party'},
{ name: 'Pick up my kids from school'},
{ name: 'Deliver my package'},
{ name:'AC repair'},

];

class Task {
  constructor() {
    const randomTask = taskList[Math.floor(Math.random() * taskList.length)];
    this.element = document.createElement('div');
    this.element.classList.add('task-card');
    this.element.innerHTML = `
      <h4>${randomTask.name}</h4>
    `;
    this.width = 120;
    this.height = 80;
    this.velocityX = (Math.random() - 0.5) * 6;
    this.velocityY = (Math.random() - 0.5) * 6;
    this.timestamp = Date.now();

    // Find an available position for the new task
    let overlapping = true;
    while (overlapping) {
      this.x = Math.random() * (gameBoard.offsetWidth - this.width);
      this.y = Math.random() * (gameBoard.offsetHeight - this.height);
      overlapping = this.checkOverlap();
    }

    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
    taskContainer.appendChild(this.element);
    this.element.addEventListener('click', this.slash.bind(this));
  }

  checkOverlap() {
    for (let i = 0; i < tasks.length; i++) {
      const dx = this.x - tasks[i].x;
      const dy = this.y - tasks[i].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.width) {
        return true;
      }
    }
    return false;
  }

  move() {
    this.x += this.velocityX;
    this.y += this.velocityY;

    if (this.x <= 0 || this.x + this.width >= gameBoard.offsetWidth) {
      this.velocityX *= -1;
    }

    if (this.y <= 0 || this.y + this.height >= gameBoard.offsetHeight) {
      this.velocityY *= -1;
    }

    this.checkCollision();

    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
  }

  checkCollision() {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i] !== this) {
        const dx = this.x - tasks[i].x;
        const dy = this.y - tasks[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.width) {
          const angle = Math.atan2(dy, dx);
          const sin = Math.sin(angle);
          const cos = Math.cos(angle);

          const tempVelocityX = this.velocityX * cos + tasks[i].velocityX * sin;
          const tempVelocityY = this.velocityY * cos + tasks[i].velocityY * sin;
          tasks[i].velocityX = this.velocityX * sin + tasks[i].velocityX * cos;
          tasks[i].velocityY = this.velocityY * sin + tasks[i].velocityY * cos;
          this.velocityX = tempVelocityX;
          this.velocityY = tempVelocityY;

          const overlap = this.width - distance;
          const separationDistance = overlap / 2;
          this.x += Math.cos(angle) * separationDistance;
          this.y += Math.sin(angle) * separationDistance;
          tasks[i].x -= Math.cos(angle) * separationDistance;
          tasks[i].y -= Math.sin(angle) * separationDistance;
        }
      }
    }
  }

  slash() {
    if (!this.element.classList.contains('slashed')) {
      this.element.classList.add('slashed');
      slashSound.currentTime = 0;
      slashSound.play();
      score++;
      scoreElement.textContent = score;
      setTimeout(() => {
        this.element.remove();
        tasks = tasks.filter(task => task !== this);
      }, 1000);
    }
  }
}

let gameRunning = false;
let gameStarted = false;

let previewInterval;

function previewGame() {
  gameRunning = false;
  gameStarted = false;
  previewInterval = setInterval(() => {
    if (tasks.length < maxTasks) {
      const task = new Task();
      tasks.push(task);
    }

    tasks = tasks.filter(task => {
      if (Date.now() - task.timestamp < 10000) { // If the task is less than 10 seconds old
        task.move();
        return true;
      } else {
        task.element.remove();
        return false; // Remove the task if it's older than 10 seconds
      }
    });
  }, 1000 ); // Update tasks 60 times per second

  startButton.disabled = false;
  stopButton.disabled = true;
}

function startGame() {
  clearInterval(previewInterval);
  gameRunning = true;
  gameStarted = true;
  gameInterval = setInterval(() => {
    if (tasks.length < maxTasks) {
      const task = new Task();
      tasks.push(task);
    }

    tasks.forEach(task => {
      task.move();
    });
  }, 1000); // Update tasks 60 times per second

  backgroundMusic.play();
  startButton.disabled = true;
  stopButton.disabled = false;
}

function stopGame() {
  gameRunning = false;
  clearInterval(gameInterval);
  backgroundMusic.pause();
  startButton.disabled = false;
  stopButton.disabled = true;
}

function resetGame() {
  stopGame();
  tasks.forEach(task => {
    task.element.remove();
  });
  tasks = [];
  score = 0;
  scoreElement.textContent = score;
}

function setMaxTasks() {
  const screenWidth = window.innerWidth;
  if (screenWidth >= 1200) {
    maxTasks = 8;
  } else if (screenWidth >= 992) {
    maxTasks = 20;
  } else if (screenWidth >= 768) {
    maxTasks = 6;
  } else {
    maxTasks = 5;
  }
}

function isOverlapping(task) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i] !== task) {
      const dx = task.x - tasks[i].x;
      const dy = task.y - tasks[i].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < task.width) {
        return true;
      }
    }
  }
  return false;
}

startButton.addEventListener('click', startGame);
stopButton.addEventListener('click', stopGame);
resetButton.addEventListener('click', resetGame);
window.addEventListener('resize', setMaxTasks);
setMaxTasks();

// Early access form submission



// Call previewGame when the game loads
window.onload = previewGame;

const typingText = document.getElementById('typing-text');
const questions = [
  "Ever feel overwhelmed by too many tasks and too little time?",
  "Are deadlines stressing you out?",
  "Don't you wish you had more time?",
  "Wish you had a reliable helping hand?",
  "Need help but don’t know where to find it quickly?"
];
let questionIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  const currentQuestion = questions[questionIndex];

  if (isDeleting) {
    typingText.textContent = currentQuestion.substring(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting = false;
      questionIndex = (questionIndex + 1) % questions.length; 
      setTimeout(type, 1000); // Pause after deleting
    } else {
      setTimeout(type, 50); // Typing speed (delete)
    }

  } else {
    typingText.textContent = currentQuestion.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentQuestion.length) {
      isDeleting = true;
      setTimeout(type, 2000); // Pause before deleting
    } else {
      setTimeout(type, 100); // Typing speed (write)
    }
  }
}

type(); // Start the typing effect

const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.target;

    // Remove active class from all tabs and hide content
    tabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(tc => tc.style.display = 'none');

    // Add active class to clicked tab and show corresponding content
    tab.classList.add('active');
    document.getElementById(target).style.display = 'block';
  });
});
const firebaseConfig = {
  apiKey: "AIzaSyBAJVIkxRxLUE0EJ90vH8p8x0kps047tWU",
  authDomain: "taskninja-4d663.firebaseapp.com",
  projectId: "taskninja-4d663",
  storageBucket: "taskninja-4d663.appspot.com",
  messagingSenderId: "378697353386",
  appId: "1:378697353386:web:a0634849bb30b86da828d3",
  measurementId: "G-VK3Z38F452"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


// Form Submission Handler 
const earlyAccessForm = document.getElementById('early-access-form');

earlyAccessForm.addEventListener('submit', (event) => {
  event.preventDefault(); 

  const email = document.getElementById('email-input').value;

  // Add Email to Firestore
  db.collection('emails').add({
    email: email
  })
  .then(() => {
    console.log('Email added to Firestore!');
    alert('Thank you for subscribing!');
    document.getElementById('email-input').value = '';
  })
  .catch(error => {
    console.error('Error adding document: ', error);
    alert('There was an error subscribing. Please try again.');
  });
});
window.addEventListener('scroll', () => {
  const steps = document.querySelectorAll('.how-it-works .step');

  steps.forEach(step => {
      const speed = step.getAttribute('data-speed'); 
      const top = step.getBoundingClientRect().top;

      if (top < window.innerHeight && top > -step.offsetHeight) { 
          step.style.transform = `translateY(${top * speed * 0.1}px)`; 
      }
  });
});
