const menuButton = document.querySelector("#menu-toggle");
const navigation = document.querySelector("nav ul");

menuButton.addEventListener("click", () => {
    navigation.classList.toggle("open");
    const isOpen = navigation.classList.contains("open");
    menuButton.textContent = isOpen ? "Close" : "Menu";
    menuButton.setAttribute("aria-expanded", isOpen.toString());
});

document.querySelector("#currentyear").textContent = new Date().getFullYear();
document.querySelector("#lastModified").textContent = `Last Modification: ${document.lastModified}`;

const courses = [
    { subject: "CSE", number: 110, title: "Intro to Programming", credits: 2, completed: true },
    { subject: "WDD", number: 130, title: "Web Fundamentals", credits: 2, completed: true },
    { subject: "CSE", number: 111, title: "Programming with Functions", credits: 2, completed: false },
    { subject: "CSE", number: 210, title: "Programming with Classes", credits: 2, completed: false },
    { subject: "WDD", number: 131, title: "Dynamic Web Fundamentals", credits: 2, completed: true },
    { subject: "WDD", number: 231, title: "Frontend Web Development I", credits: 2, completed: false }
];

const courseContainer = document.querySelector(".course-list");
const totalCreditsDisplay = document.querySelector("#total-credits");

function displayCourses(filteredList) {
    courseContainer.innerHTML = "";

    filteredList.forEach((course) => {
        const card = document.createElement("div");
        card.className = `course-card ${course.completed ? "completed" : "not-completed"}`;
        card.textContent = `${course.completed ? "Completed: " : ""}${course.subject} ${course.number}`;
        card.setAttribute("title", course.title);
        courseContainer.appendChild(card);
    });

    const total = filteredList.reduce((sum, course) => sum + course.credits, 0);
    totalCreditsDisplay.textContent = `The total credits for courses listed above is ${total}.`;
}

document.querySelector("#all").addEventListener("click", () => displayCourses(courses));
document.querySelector("#cse").addEventListener("click", () => {
    displayCourses(courses.filter((course) => course.subject === "CSE"));
});
document.querySelector("#wdd").addEventListener("click", () => {
    displayCourses(courses.filter((course) => course.subject === "WDD"));
});

displayCourses(courses);
