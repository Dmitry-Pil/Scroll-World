<template>
  <!-- the footer separates the story, visual production, website tools and authorship -->
  <footer class="site_footer" aria-label="About this project">
    <section class="site_footer__about" aria-labelledby="footer_about">
      <h2 id="footer_about">About</h2>
      <p>A scroll-driven story about making time for your dog.</p>
      <p class="site_footer__detail">Everyday moments. Shared adventures. Time together.</p>
    </section>
    <!-- credit the platform separately from the image and video generation models -->
    <section aria-labelledby="footer_visuals">
      <h2 id="footer_visuals">Visual production</h2>
      <p>Created in Magnific</p>
      <p class="site_footer__detail">Images: Seedream 5.0<br>Video: Seedance 2.5</p>
    </section>
    <!-- distinguish the site stack from the coding assistant and editor -->
    <section aria-labelledby="footer_stack">
      <h2 id="footer_stack">Website</h2>
      <p>Vue 3 / Vite<br>SCSS / GSAP</p>
      <p class="site_footer__detail">Developed with Codex in Visual Studio Code.</p>
    </section>
    <!-- the author directed the visuals, edited the film and created the website -->
    <section aria-labelledby="footer_creator">
      <h2 id="footer_creator">Created by</h2>
      <p>Dmitry Pilipishin</p>
      <p class="site_footer__detail">Concept, image and video generation, video editing, website design and development.</p>
    </section>
  </footer>
</template>
