const modal = document.getElementById("custom-modal");
const modalBody = document.querySelector(".modal-body");

const showModal = (text) => {
  modal.style.display = "block";
  modal.classList.add("show");
  modal.style.backgroundColor = "#808080b5";
  modalBody.innerText = text;
};
const removeModal = () => {
  modal.style.display = "none";
  modal.classList.remove("show");
};

export { showModal, removeModal };
