# Mascot Style Guide — Sentinel the Fox

This page shows all seven mascot admonition styles for reference. Use it to verify CSS rendering and image padding after generating Sentinel's poses.

!!! mascot-neutral "A Note from Sentinel"
    <img src="../../img/mascot/neutral.png" class="mascot-admonition-img" alt="Sentinel neutral pose">
    This is the **neutral** style, used for general sidebars, asides, or any
    note that doesn't call for a specific emotional tone.

!!! mascot-welcome "Welcome!"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Sentinel waving welcome">
    This is the **welcome** style, used at chapter openings.
    *"Trust, but verify — let's get started!"*

!!! mascot-thinking "Key Insight"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Sentinel thinking">
    This is the **thinking** style, used for key concepts and "aha" moments
    that connect ideas across chapters.

!!! mascot-tip "Sentinel's Tip"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Sentinel giving a tip">
    This is the **tip** style, used for hints, shortcuts, and practical advice
    that saves students time or surfaces a useful habit.

!!! mascot-warning "Watch Out!"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Sentinel warning">
    This is the **warning** style, used for common mistakes, footguns, and
    insecure patterns to avoid.

!!! mascot-encourage "You've Got This"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Sentinel encouraging">
    This is the **encourage** style, used for difficult content where students
    may struggle. Normalize the struggle and keep them moving.

!!! mascot-celebration "Well Done!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Sentinel celebrating">
    This is the **celebration** style, used at section completions and
    achievements. Dark background so pale confetti sparkles remain visible.

---

## Padding Check

If any pose appears too small inside its admonition box, the source PNG has
excess transparent padding. Trim it with:

```bash
python ../claude-skills/src/image-utils/trim-padding-from-image.py docs/img/mascot/FILENAME.png
```

Replace `FILENAME` with the specific pose (e.g. `neutral`, `welcome`, etc.).
