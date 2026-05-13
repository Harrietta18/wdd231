// 1. Responsive Menu
const menuButton = document.querySelector('#menu-toggle');
const navigation = document.querySelector('nav ul');

menuButton.addEventListener('click', () => {
    navigation.classList.toggle('open');
    menuButton.textContent = navigation.classList.contains('open') ? 'X' : '☰';
});

// 2. Dynamic Footer Dates
document.getElementById("currentyear").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = `Last Modification: ${document.lastModified}`;

// 3. Updated Course Array based on your progress
const courses = [
    { subject: 'CSE', number: 110, title: 'Intro to Programming', credits: 2, completed: true },
    { subject: 'WDD', number: 130, title: 'Web Fundamentals', credits: 2, completed: true },
    { subject: 'CSE', number: 111, title: 'Programming w/ Functions', credits: 2, completed: false }, // Currently doing
    { subject: 'CSE', number: 210, title: 'Programming w/ Classes', credits: 2, completed: false }, // Remaining
    { subject: 'WDD', number: 131, title: 'Dynamic Web Viz', credits: 2, completed: true },
    { subject: 'WDD', number: 231, title: 'Frontend Web Dev I', credits: 2, completed: false }  // Currently doing
];

// 4. Display Logic
const courseContainer = document.querySelector('.course-list');
const totalCreditsDisplay = document.getElementById('total-credits');

function displayCourses(filteredList) {
    courseContainer.innerHTML = "";
    
    filteredList.forEach(course => {
        const card = document.createElement("div");
        card.className = `course-card ${course.completed ? 'completed' : 'not-completed'}`;
        
        // Add checkmark if completed, matching 17786273018983243913720808544327_7fd6fc.jpg
        const checkmark = course.completed ? '✔ ' : '';
        card.innerHTML = `<strong>${checkmark}${course.subject} ${course.number}</strong>`;
        
        courseContainer.appendChild(card);
    });

    const total = filteredList.reduce((sum, course) => sum + course.credits, 0);
    totalCreditsDisplay.textContent = `The total credit for courses listed above is ${total}`;
}

// Button Listeners
document.querySelector('#all').addEventListener('click', () => displayCourses(courses));
document.querySelector('#cse').addEventListener('click', () => {
    displayCourses(courses.filter(c => c.subject === 'CSE'));
});
document.querySelector('#wdd').addEventListener('click', () => {
    displayCourses(courses.filter(c => c.subject === 'WDD'));
});

// Initial Load
displayCourses(courses);