const viewMore = document.querySelectorAll(".view-more");

// console.log(mediaContent);
for (const element of viewMore) {
    element.addEventListener("click", () => {
        const content = element.nextSibling;

        content.classList.toggle("is-open");
    });
}
