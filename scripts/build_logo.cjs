const fs = require('fs');
const { execSync } = require('child_process');

// Build the full SVG vector matching the attached Amani Junior Academy & JSS official crest emblem exactly
const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <!-- Circular Text Paths -->
    <!-- Top Arc for AMANI JUNIOR ACADEMY: radius 405 around (500,500) -->
    <path id="topTextArc" d="M 130 500 A 405 405 0 0 1 870 500" fill="none" />
    
    <!-- Arc for AND JSS banner ribbon: radius 365 around (500,500) -->
    <path id="andJssArc" d="M 330 290 A 365 365 0 0 1 670 290" fill="none" />
    
    <!-- Bottom Arc for STRIVE TO ACHIEVE: radius 405 around (500,500) -->
    <!-- Sweeps left-to-right along bottom so text is right-side up -->
    <path id="bottomTextArc" d="M 175 745 A 405 405 0 0 0 825 745" fill="none" />

    <!-- Color Gradients -->
    <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#C59B27" />
      <stop offset="30%" stop-color="#E5A823" />
      <stop offset="70%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#FFFBEB" />
    </linearGradient>

    <linearGradient id="handsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#D4AF37" />
      <stop offset="100%" stop-color="#B8860B" />
    </linearGradient>
  </defs>

  <!-- Clean Canvas Background -->
  <rect width="1000" height="1000" fill="#FFFFFF" />

  <!-- Outermost Thin Gold Border -->
  <circle cx="500" cy="500" r="486" fill="none" stroke="#C59B27" stroke-width="4" />

  <!-- Outermost Navy Blue Ring -->
  <circle cx="500" cy="500" r="472" fill="none" stroke="#162E56" stroke-width="22" />

  <!-- Middle Gold Separation Ring -->
  <circle cx="500" cy="500" r="459" fill="none" stroke="#C59B27" stroke-width="4" />

  <!-- Wide White Circular Band -->
  <circle cx="500" cy="500" r="457" fill="#FFFFFF" />

  <!-- ============================================== -->
  <!-- TOP BANNER TEXT: AMANI JUNIOR ACADEMY          -->
  <!-- ============================================== -->
  <text fill="#162E56" font-family="'Cinzel', 'Montserrat', 'DejaVu Sans', Arial, sans-serif" font-weight="900" font-size="47" letter-spacing="4">
    <textPath href="#topTextArc" startOffset="50%" text-anchor="middle">
      AMANI JUNIOR ACADEMY
    </textPath>
  </text>

  <!-- "AND JSS" Curved Ribbon Badge -->
  <!-- Navy Banner behind AND JSS -->
  <path d="M 390 286 C 440 268 560 268 610 286 L 602 232 C 554 218 446 218 398 232 Z" fill="#162E56" />
  <path d="M 390 286 C 440 268 560 268 610 286" fill="none" stroke="#C59B27" stroke-width="2" />
  <path d="M 398 232 C 446 218 554 218 602 232" fill="none" stroke="#C59B27" stroke-width="2" />
  <text fill="#FFFFFF" font-family="'Cinzel', 'Montserrat', 'DejaVu Sans', Arial, sans-serif" font-weight="900" font-size="24" letter-spacing="3.5">
    <textPath href="#andJssArc" startOffset="50%" text-anchor="middle">
      AND JSS
    </textPath>
  </text>

  <!-- Left & Right Gold Alignment Dots -->
  <circle cx="162" cy="495" r="13" fill="#C59B27" />
  <circle cx="838" cy="495" r="13" fill="#C59B27" />

  <!-- ============================================== -->
  <!-- BOTTOM NAVY BANNER & MOTTO: STRIVE TO ACHIEVE  -->
  <!-- ============================================== -->
  <!-- Swallowtail Ribbon Wing Left -->
  <polygon points="120,610 205,600 205,690 135,705 160,650" fill="#162E56" />
  <!-- Swallowtail Ribbon Wing Right -->
  <polygon points="880,610 795,600 795,690 865,705 840,650" fill="#162E56" />

  <!-- Main Bottom Curved Navy Ribbon -->
  <!-- Spans from angle 150deg to 30deg along outer radius 460 and inner radius 335 -->
  <path d="M 102 730 A 460 460 0 0 0 898 730 L 790 668 A 335 335 0 0 1 210 668 Z" fill="#162E56" />
  
  <!-- Ribbon Golden Border Trims -->
  <path d="M 102 730 A 460 460 0 0 0 898 730" fill="none" stroke="#C59B27" stroke-width="3" />
  <path d="M 210 668 A 335 335 0 0 0 790 668" fill="none" stroke="#C59B27" stroke-width="3" />

  <!-- Motto Text: STRIVE TO ACHIEVE -->
  <text fill="#FFFFFF" font-family="'Cinzel', 'Montserrat', 'DejaVu Sans', Arial, sans-serif" font-weight="900" font-size="44" letter-spacing="5">
    <textPath href="#bottomTextArc" startOffset="50%" text-anchor="middle">
      STRIVE TO ACHIEVE
    </textPath>
  </text>

  <!-- ============================================== -->
  <!-- INNER SHIELD & BORDER                          -->
  <!-- ============================================== -->
  <!-- Inner Gold Ring Border -->
  <circle cx="500" cy="500" r="334" fill="none" stroke="#C59B27" stroke-width="6" />

  <!-- Inner Navy Border Line -->
  <circle cx="500" cy="500" r="327" fill="none" stroke="#162E56" stroke-width="3" />

  <!-- Inner Center White Shield -->
  <circle cx="500" cy="500" r="325" fill="#FFFFFF" />

  <!-- ============================================== -->
  <!-- 1. THE GOLDEN RISING SUN                       -->
  <!-- ============================================== -->
  <g id="sunGroup">
    <!-- 11 Radiating Pointed Sun Rays -->
    <polygon points="378,396 384,400 332,392" fill="#E5A823" />
    <polygon points="398,366 405,373 352,342" fill="#E5A823" />
    <polygon points="418,340 428,348 382,300" fill="#E5A823" />
    <polygon points="444,324 454,330 422,270" fill="#E5A823" />
    <polygon points="474,314 484,316 462,254" fill="#E5A823" />
    <!-- Center Top Ray -->
    <polygon points="494,310 506,310 500,242" fill="#E5A823" />
    <polygon points="516,316 526,314 538,254" fill="#E5A823" />
    <polygon points="546,330 556,324 578,270" fill="#E5A823" />
    <polygon points="572,348 582,340 618,300" fill="#E5A823" />
    <polygon points="595,373 602,366 648,342" fill="#E5A823" />
    <polygon points="616,400 622,396 668,392" fill="#E5A823" />

    <!-- Semi-Circular Golden Sun Arch / Disc -->
    <path d="M 445 402 A 55 55 0 0 1 555 402 Z" fill="#E5A823" />
    <path d="M 430 402 A 70 70 0 0 1 570 402" fill="none" stroke="#E5A823" stroke-width="13" stroke-linecap="round" />
  </g>

  <!-- ============================================== -->
  <!-- 2. THE OPEN BOOK OF KNOWLEDGE                  -->
  <!-- ============================================== -->
  <g id="openBookGroup">
    <!-- Navy Blue Book Cover Base -->
    <path d="M 500 630 L 285 640 L 335 502 Q 418 518 500 565 Q 582 518 665 502 L 715 640 Z" fill="#162E56" />

    <!-- Left Book Spread Pages (White Field with Navy Outlines) -->
    <path d="M 495 565 Q 418 518 344 506 L 298 632 Q 405 608 495 624 Z" fill="#FFFFFF" stroke="#162E56" stroke-width="5" stroke-linejoin="round" />
    <!-- Left Inner Curved Page Lines -->
    <path d="M 358 534 Q 418 544 485 578" fill="none" stroke="#162E56" stroke-width="3" />
    <path d="M 342 564 Q 408 574 485 600" fill="none" stroke="#162E56" stroke-width="3" />
    <path d="M 326 596 Q 402 604 485 614" fill="none" stroke="#162E56" stroke-width="3" />

    <!-- Right Book Spread Pages -->
    <path d="M 505 565 Q 582 518 656 506 L 702 632 Q 595 608 505 624 Z" fill="#FFFFFF" stroke="#162E56" stroke-width="5" stroke-linejoin="round" />
    <!-- Right Inner Curved Page Lines -->
    <path d="M 642 534 Q 582 544 515 578" fill="none" stroke="#162E56" stroke-width="3" />
    <path d="M 658 564 Q 592 574 515 600" fill="none" stroke="#162E56" stroke-width="3" />
    <path d="M 674 596 Q 598 604 515 614" fill="none" stroke="#162E56" stroke-width="3" />

    <!-- Center Spine Crease Line -->
    <line x1="500" y1="560" x2="500" y2="628" stroke="#162E56" stroke-width="6" stroke-linecap="round" />
  </g>

  <!-- ============================================== -->
  <!-- 3. THE TREE OF LIFE & LEARNING                 -->
  <!-- ============================================== -->
  <g id="treeGroup">
    <!-- Tree Trunk & Main Branches in Deep Navy Blue -->
    <!-- Lower roots rooted directly into the open book pages -->
    <path d="M 488 565 Q 458 575 430 580 Q 462 570 492 552 L 493 470 Q 458 444 420 435 Q 468 444 496 460 L 498 418 Q 468 392 436 380 Q 472 390 500 410 Q 528 390 564 380 Q 532 392 502 418 L 504 460 Q 532 444 580 435 Q 542 444 507 470 L 508 552 Q 538 570 570 580 Q 542 575 512 565 Z" fill="#162E56" />

    <!-- Lush Stylized Leaves in Educational Emerald Green -->
    <!-- Top Apex Leaves -->
    <path d="M 500 338 Q 515 364 500 394 Q 485 364 500 338 Z" fill="#43A047" stroke="#2E7D32" stroke-width="1.5" />
    <path d="M 500 354 Q 526 364 522 390 Q 505 384 500 354 Z" fill="#388E3C" />
    <path d="M 500 354 Q 474 364 478 390 Q 495 384 500 354 Z" fill="#43A047" />

    <!-- Upper Branch Left Leaves -->
    <path d="M 464 346 Q 485 364 470 384 Q 450 368 464 346 Z" fill="#4CAF50" stroke="#2E7D32" stroke-width="1.5" />
    <path d="M 432 368 Q 458 380 448 404 Q 424 394 432 368 Z" fill="#388E3C" stroke="#2E7D32" stroke-width="1.5" />
    <path d="M 408 388 Q 434 398 426 422 Q 400 414 408 388 Z" fill="#43A047" stroke="#2E7D32" stroke-width="1.5" />
    <path d="M 378 414 Q 408 420 402 442 Q 375 438 378 414 Z" fill="#4CAF50" stroke="#2E7D32" stroke-width="1.5" />
    <path d="M 436 408 Q 458 420 448 442 Q 428 428 436 408 Z" fill="#2E7D32" stroke="#1B5E20" stroke-width="1.5" />

    <!-- Upper Branch Right Leaves -->
    <path d="M 536 346 Q 550 368 530 384 Q 515 364 536 346 Z" fill="#388E3C" stroke="#2E7D32" stroke-width="1.5" />
    <path d="M 568 368 Q 576 394 552 404 Q 542 380 568 368 Z" fill="#4CAF50" stroke="#2E7D32" stroke-width="1.5" />
    <path d="M 592 388 Q 600 414 574 422 Q 566 398 592 388 Z" fill="#388E3C" stroke="#2E7D32" stroke-width="1.5" />
    <path d="M 622 414 Q 625 438 598 442 Q 592 420 622 414 Z" fill="#43A047" stroke="#2E7D32" stroke-width="1.5" />
    <path d="M 564 408 Q 572 428 552 442 Q 542 420 564 408 Z" fill="#2E7D32" stroke="#1B5E20" stroke-width="1.5" />

    <!-- Mid Canopy Foliage Clusters -->
    <path d="M 454 434 Q 476 448 466 472 Q 444 456 454 434 Z" fill="#43A047" stroke="#2E7D32" stroke-width="1.5" />
    <path d="M 414 448 Q 438 458 428 482 Q 404 468 414 448 Z" fill="#388E3C" stroke="#2E7D32" stroke-width="1.5" />
    <path d="M 464 474 Q 486 486 474 508 Q 454 494 464 474 Z" fill="#4CAF50" stroke="#2E7D32" stroke-width="1.5" />

    <path d="M 546 434 Q 556 456 534 472 Q 524 448 546 434 Z" fill="#388E3C" stroke="#2E7D32" stroke-width="1.5" />
    <path d="M 586 448 Q 596 468 572 482 Q 562 458 586 448 Z" fill="#43A047" stroke="#2E7D32" stroke-width="1.5" />
    <path d="M 536 474 Q 546 494 526 508 Q 514 486 536 474 Z" fill="#4CAF50" stroke="#2E7D32" stroke-width="1.5" />
  </g>

  <!-- ============================================== -->
  <!-- 4. THE TORCH OF ENLIGHTENMENT                  -->
  <!-- ============================================== -->
  <g id="torchGroup">
    <!-- Vivid Burning Torch Flame -->
    <!-- Outer Golden Amber Flame Shape -->
    <path d="M 500 542 C 526 574 542 596 540 616 C 536 636 520 646 500 646 C 480 646 464 636 460 616 C 458 596 474 574 500 542 Z" fill="url(#flameGrad)" stroke="#C59B27" stroke-width="3" />
    <!-- Secondary Licking Flame Spikes -->
    <path d="M 488 574 C 472 594 468 610 476 626 C 480 616 486 606 490 590 Z" fill="#E5A823" />
    <path d="M 512 574 C 528 594 532 610 524 626 C 520 616 514 606 510 590 Z" fill="#E5A823" />
    <!-- Glowing White/Ivory Hot Center -->
    <path d="M 500 578 C 512 598 518 612 516 626 C 514 636 508 640 500 640 C 492 640 486 636 484 626 C 482 612 488 598 500 578 Z" fill="#FFFFFF" />

    <!-- Torch Cup (Navy Blue Fluted Chalice) -->
    <path d="M 458 646 L 542 646 L 536 662 L 464 662 Z" fill="#162E56" stroke="#162E56" stroke-width="2" />
    <line x1="462" y1="653" x2="538" y2="653" stroke="#FFFFFF" stroke-width="1.8" />
    
    <!-- Torch Cone -->
    <path d="M 464 662 L 536 662 L 522 682 L 478 682 Z" fill="#162E56" />
    <line x1="482" y1="682" x2="518" y2="682" stroke="#FFFFFF" stroke-width="2" />

    <!-- Torch Base Stem -->
    <path d="M 480 682 L 520 682 L 515 698 L 485 698 Z" fill="#162E56" />
    <path d="M 488 698 L 512 698 L 507 766 L 493 766 Z" fill="#162E56" />
    <circle cx="500" cy="767" r="6" fill="#162E56" />
  </g>

  <!-- ============================================== -->
  <!-- 5. THE SUPPORTING CLASPED HANDS                -->
  <!-- ============================================== -->
  <g id="handsGroup">
    <!-- Left Hand & Arm (Golden Ochre) -->
    <path d="M 286 644 C 314 660 380 720 460 740 C 480 745 502 745 506 738 C 500 732 476 724 450 714 C 385 688 324 648 286 644 Z" fill="url(#handsGrad)" stroke="#162E56" stroke-width="4.5" stroke-linejoin="round" />
    
    <!-- Right Hand & Arm -->
    <path d="M 714 644 C 686 660 620 720 540 740 C 520 745 498 745 494 738 C 500 732 524 724 550 714 C 615 688 676 648 714 644 Z" fill="url(#handsGrad)" stroke="#162E56" stroke-width="4.5" stroke-linejoin="round" />

    <!-- Interlocked Clasped Fingers and Palms -->
    <g stroke="#162E56" stroke-width="3.5" fill="#C59B27">
      <path d="M 468 714 C 484 708 516 710 518 720 C 515 728 484 724 468 718 Z" />
      <path d="M 458 724 C 476 718 528 720 530 732 C 524 740 478 736 458 730 Z" />
      <path d="M 450 734 C 468 730 540 734 542 744 C 534 752 470 746 450 740 Z" />
      <path d="M 464 744 C 484 744 530 746 532 756 C 524 762 478 758 464 750 Z" />
      <ellipse cx="500" cy="742" rx="18" ry="12" fill="#D4AF37" stroke="#162E56" stroke-width="3" />
    </g>
  </g>
</svg>
`;

fs.writeFileSync('public/amani_logo.svg', svgContent, 'utf8');
console.log('Saved public/amani_logo.svg');

// Render high-res PNG and JPG using rsvg-convert & convert
execSync('rsvg-convert -w 1200 -h 1200 -f png public/amani_logo.svg -o public/amani_logo.png');
console.log('Generated public/amani_logo.png');

execSync('convert public/amani_logo.png -quality 98 public/amani_logo.jpg');
console.log('Generated public/amani_logo.jpg');

// Copy into all other logo paths in the project
fs.copyFileSync('public/amani_logo.jpg', 'public/images/amani_school_logo_1789049725831.jpg');
fs.copyFileSync('public/amani_logo.jpg', 'src/assets/images/amani_school_logo_1789049725831.jpg');
console.log('Synchronized to public/images and src/assets/images');
