const form = () => {
  const contactForm = document.querySelector(".contactForm"),
    responseMessage = document.querySelector(".response");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    responseMessage.classList.add("open");
    responseMessage.textContent = "Please wait...";

    try {
      const response = await fetch("https://formspree.io/f/mnndwpyj", { // Replace with your Formspree endpoint
        method: "POST",
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        responseMessage.textContent = "Thank you for your message!";
        form.reset();
      } else {
        responseMessage.textContent = "Oops! There was a problem.";
      }
    } catch (error) {
      responseMessage.textContent = "Oops! There was a problem.";
      console.error(error.message);
    }

    setTimeout(() => {
      responseMessage.classList.remove("open");
      responseMessage.textContent = "";
    }, 3000);
  });
};
export default form;