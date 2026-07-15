export function createNovelCard(novel, basePath = "") {

    const novelLink = (basePath === "" ? "pages/" : "") + `novel.html?slug=${novel.slug}`;
    const coverSrc = `${basePath}${novel.cover}`;

    return `

    <article class="novel-card">

        <a href="${novelLink}">

            <div class="novel-card__cover">

                <img
                    src="${coverSrc}"
                    alt="${novel.title}"
                    loading="lazy">

            </div>

            <div class="novel-card__content">

                <div class="novel-card__genres">

                    ${novel.genres.map(g => `
                        <span class="badge">${g}</span>
                    `).join("")}

                </div>

                <h3 class="novel-card__title">

                    ${novel.title}

                </h3>

                <div class="novel-card__meta">

                    <span>${novel.chapters} Chapter</span>

                </div>

            </div>

        </a>

    </article>

    `;

}