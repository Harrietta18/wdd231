/* ==========================================================================
   JOIN INTERACTION LOGIC CONTROL (join.js)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. SET INJECTED HIDDEN FORM ACCURATE TIMESTAMP
    const timestampField = document.getElementById("formTimestamp");
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }

    // 2. TRIGGER CARDS SEQUENCE ENTRANCE ANIMATION OVER TIME
    const cardElements = document.querySelectorAll(".animate-card");
    cardElements.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add("visible-state");
        }, index * 175); // Stagger entry cleanly
    });

    // 3. ACCESSIBLE DIALOG MODAL MECHANICS SYSTEM
    const openTriggers = document.querySelectorAll(".modal-open-btn");
    const closeTriggers = document.querySelectorAll(".modal-close-btn");

    openTriggers.forEach(button => {
        button.addEventListener("click", () => {
            const targetModalId = button.getAttribute("data-target");
            const structuralModal = document.getElementById(targetModalId);
            if (structuralModal) {
                structuralModal.showModal(); // Pop overlay frame onto view stack
            }
        });
    });

    closeTriggers.forEach(button => {
        button.addEventListener("click", () => {
            const openModal = button.closest("dialog");
            if (openModal) {
                openModal.close(); // Collapse view port
            }
        });
    });

    // Close modal cleanly if user clicks background overlay mask boundary
    window.addEventListener("click", (event) => {
        if (event.target.tagName === "DIALOG") {
            event.target.close();
        }
    });
});