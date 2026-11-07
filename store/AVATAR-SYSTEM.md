# SURMOI — PROFESSIONAL VIRTUAL AVATAR SYSTEM

## MASTER DEVELOPMENT PROMPT

*(Omar's specification, received 2026-11-08. This file is the master reference for the avatar system. Do not edit without his order.)*

You are a senior full-stack developer, 3D/2D avatar engineer, fashion e-commerce architect, UI/UX designer, computer vision engineer, and technical product architect.

Your mission is to build a professional, functional, production-oriented Virtual Avatar System for SURMOI, a Moroccan online clothing store that will use YouCan as its e-commerce platform.

This is an existing project, not a new project from scratch.

Existing website:
https://lkiwan.github.io/BD-CHY/store/

The current website already contains an initial avatar shopping interface, clothing categories, product cards, outfit selection, and a basic virtual fitting experience.

IMPORTANT:
First inspect the existing project, its source code, architecture, assets, and current functionality.

Do not unnecessarily replace the existing website.
Do not remove working features.
Do not create a completely separate demo when the task is to improve the existing project.

Your primary focus is the AVATAR SYSTEM.

Do not prioritize payment integration, store redesign, marketing, or unrelated e-commerce features until the avatar system is working correctly.

The objective is to create a realistic, customizable, measurement-aware avatar that can wear different clothing products through a reliable virtual clothing rendering system.

The first avatar must be an ADULT MALE DEFAULT AVATAR.

The system must be designed so that female avatars, additional body types, and more advanced virtual try-on technologies can be added later.

==================================================
1. PROJECT OBJECTIVE
==================================================

Build a Virtual Avatar System that allows customers to:

1. Select a default male avatar.
2. Customize the avatar's body proportions.
3. Enter their body measurements.
4. Adjust their height and weight.
5. Choose a body shape.
6. Preview their avatar.
7. Select clothing products.
8. See clothing applied to their avatar.
9. Combine multiple clothing products into a complete outfit.
10. Change clothing colors and sizes.
11. Save their avatar configuration.
12. Save outfit combinations.
13. Reopen and edit saved avatars.
14. Prepare selected products for integration with YouCan.

The avatar must be visually realistic and consistent.

The avatar must not change its identity, face, body proportions, or standing position every time the customer changes clothing.

Clothing must be separate from the underlying avatar.

The avatar is the base model.

Clothing is an independent layer.

The rendering system must combine these layers without generating a completely new character image for every clothing selection.

==================================================
2. FIRST TASK: AUDIT THE EXISTING PROJECT
==================================================

Before making modifications:

Inspect the existing application.

Identify:

* Frontend framework.
* Existing components.
* Existing avatar implementation.
* Existing product catalog.
* Existing clothing categories.
* Existing clothing images.
* Existing product selection logic.
* Existing state management.
* Existing storage.
* Existing dependencies.
* Existing responsive behavior.
* Existing errors.
* Existing deployment configuration.

Determine whether the existing avatar is:

A. A static image.
B. A collection of transparent clothing images.
C. A layered image composition.
D. A 3D model.
E. An AI-generated image workflow.
F. A combination of these.

Produce a concise technical assessment before implementation.

Then create a development plan.

Preserve existing working functionality.

Do not assume the existing project uses a specific framework until you inspect it.

If it uses React and TypeScript, continue using React and TypeScript.

If it uses another framework, evaluate whether modifying the current framework is better than rebuilding.

Do not introduce a new framework without a strong technical reason.

==================================================
3. DEFAULT MALE AVATAR
==================================================

Create the first default avatar as a realistic adult male fashion model.

The default avatar must be suitable for an online clothing store.

Visual requirements:

* Adult male.
* Realistic human anatomy.
* Full-body representation.
* Front-facing standing pose.
* Neutral facial expression.
* Natural proportions.
* Neutral lighting.
* Consistent camera perspective.
* Neutral background.
* Head, torso, arms, hands, legs, and feet fully visible.
* Arms slightly separated from the torso.
* Legs slightly separated.
* Feet positioned naturally.
* No cropped body parts.
* No exaggerated muscles.
* No cartoon appearance.
* No unnecessary accessories.
* No dramatic pose.
* No perspective distortion.

The avatar should have a neutral base appearance.

Use a consistent identity and body structure.

Do not generate a new face whenever clothing changes.

Do not generate a new avatar image for every product selection.

The default avatar must remain stable throughout the entire session.

IMPORTANT:

Do not treat a generated image as a complete avatar system.

The avatar must be implemented as a reusable asset with a clear rendering architecture.

If a suitable avatar asset does not exist, create a temporary placeholder and explain the asset requirements.

Do not silently substitute an unrelated character.

==================================================
4. DEFAULT MALE BODY MEASUREMENTS
==================================================

Create a configurable adult male default avatar with a realistic reference body.

Use the following DEFAULT REFERENCE MEASUREMENTS:

Height: 180 cm
Weight: 78 kg
Chest circumference: 100 cm
Waist circumference: 84 cm
Hip circumference: 98 cm
Shoulder width: 46 cm
Neck circumference: 38 cm
Arm length: 61 cm
Inseam: 82 cm
Outseam: 104 cm
Thigh circumference: 56 cm
Calf circumference: 38 cm

These values are an initial reference profile, not universal human proportions.

Do not claim that they represent an exact clothing size.

The avatar must allow users to modify these values.

Use centimeters as the default measurement unit.

Allow conversion to inches when needed.

Create a measurement system that distinguishes:

* Body measurements.
* Avatar proportions.
* Garment measurements.
* Clothing size recommendations.

These are different concepts.

Do not use the same values interchangeably.

==================================================
5. BODY MEASUREMENT SYSTEM
==================================================

Create a complete body measurement interface.

The customer must be able to enter:

HEIGHT
WEIGHT
CHEST
WAIST
HIPS
SHOULDER WIDTH
NECK
ARM LENGTH
INSEAM
OUTSEAM
THIGH
CALF

Provide:

* Numeric inputs.
* Measurement units.
* Input validation.
* Clear labels.
* Help descriptions.
* Editable values.
* Default values.
* Reset to default.
* Save measurements.
* Restore saved measurements.

All values must be editable.

Do not allow invalid values such as negative measurements.

Do not silently replace user-entered measurements.

Display validation errors clearly.

Do not infer exact body measurements from height and weight alone.

If a customer does not know their measurements, allow them to use the default avatar profile.

==================================================
6. BODY SHAPE CUSTOMIZATION
==================================================

Implement a body shape selector.

Initial body shape presets:

1. Slim.
2. Regular.
3. Athletic.
4. Broad.
5. Custom.

The default avatar should use:

Regular body shape.

The body shape selector must affect the avatar appearance when the underlying rendering technology supports it.

For a 2D avatar:

Use predefined compatible body assets or controlled image transformations.

Do not distort clothing independently from the body.

For a 3D avatar:

Use a properly rigged model and controlled morph targets or equivalent body parameters.

Do not pretend that a static image supports realistic anatomical customization.

If the existing implementation only supports static images, clearly explain which body customization features are visual approximations.

The architecture must allow future migration to a more advanced 3D avatar.

==================================================
7. AVATAR RENDERING ARCHITECTURE
==================================================

Choose the rendering approach based on the existing project.

Preferred initial approach:

A layered 2D avatar system with independent clothing assets.

The system must contain:

BASE AVATAR
UPPER BODY CLOTHING
LOWER BODY CLOTHING
OUTERWEAR
SHOES
ACCESSORIES

Each clothing category must have a defined rendering position and layer order.

Example:

Base avatar
|
|– T-shirt
|– Jeans
|– Shoes
|– Hoodie
|– Accessories

The renderer must support:

* Adding clothing.
* Removing clothing.
* Replacing clothing.
* Changing clothing colors.
* Selecting clothing variants.
* Rendering complete outfits.
* Maintaining layer alignment.
* Maintaining the avatar's identity.
* Maintaining a consistent camera position.

Do not render clothing as floating product cards over the avatar.

Do not place clothing images randomly.

Do not use CSS positioning without a defined asset coordinate system.

Create a consistent avatar canvas.

Define:

* Canvas dimensions.
* Avatar anchor points.
* Clothing anchor points.
* Layer ordering.
* Scaling rules.
* Positioning rules.
* Asset dimensions.
* Transparency requirements.

For a 2D implementation, use transparent PNG or WebP assets where appropriate.

Use a consistent front-facing asset format.

If the project already uses a better rendering technology, preserve it.

==================================================
8. CLOTHING ASSETS
==================================================

Build a clothing asset system.

Every clothing product must have a unique identifier.

Every clothing asset must contain:

* Product ID.
* Product name.
* Category.
* Color.
* Size availability.
* Price.
* Asset path.
* Rendering layer.
* Position.
* Scale.
* Compatible avatar.
* Optional garment measurements.

Initial categories:

TOPS
BOTTOMS
OUTERWEAR
SHOES
ACCESSORIES

Initial test products:

1. Basic white T-shirt.
2. Black T-shirt.
3. Gray hoodie.
4. Blue jeans.
5. Black trousers.
6. Gray sneakers.

Use the existing product data when available.

Do not invent real inventory or prices.

If test products are required, clearly mark them as demo products.

The system must distinguish:

Product photography
Avatar clothing assets
Garment measurement data
Product metadata

These are not interchangeable.

Product photos are used for the store.

Avatar clothing assets are used for virtual fitting.

Garment measurements are used for sizing and fit analysis.

==================================================
9. CLOTHING LAYER ALIGNMENT
==================================================

Implement precise clothing layer alignment.

Create a standard coordinate system for the avatar.

Each clothing asset must define:

* Anchor point.
* Position.
* Width.
* Height.
* Scale.
* Layer index.
* Compatible body profile.
* Optional adjustment limits.

Example structure:

Avatar:
id
name
height
weight
bodyMeasurements
bodyShape
baseAsset

Clothing:
id
productId
category
asset
color
layer
anchor
scale
compatibleAvatar
garmentMeasurements

Outfit:
id
avatarId
selectedClothing
createdAt

Use this as a conceptual schema.

Adapt it to the existing project architecture.

Do not create unnecessary duplicate databases.

When a customer selects a T-shirt:

1. Load the clothing asset.
2. Identify the correct avatar anchor.
3. Apply the correct rendering layer.
4. Preserve the avatar proportions.
5. Render the garment.
6. Update the outfit state.

When the customer removes the T-shirt:

Remove the corresponding clothing layer.

When the customer selects a different T-shirt:

Replace the existing upper-body clothing layer.

Do not duplicate clothing layers.

==================================================
10. BODY MEASUREMENTS AND CLOTHING FIT
==================================================

Implement a measurement-aware clothing system.

The system must distinguish:

BODY MEASUREMENTS
GARMENT MEASUREMENTS
SIZE LABELS
FIT PREFERENCES

For each garment, support:

* Chest width.
* Garment waist width.
* Hip width.
* Shoulder width.
* Sleeve length.
* Garment length.
* Inseam.
* Outseam.
* Shoe size.

Use the available garment data.

If garment measurements are missing, do not fabricate them.

Display:

* Customer body measurements.
* Garment measurements.
* Available sizes.
* Fit recommendation status.

Provide a size recommendation only when sufficient data exists.

Use clear labels:

Recommended size
Possible alternative
Insufficient measurement data

Do not claim that the virtual avatar guarantees a perfect physical fit.

Do not use AI-generated visual proportions as a substitute for garment measurements.

==================================================
11. AVATAR CUSTOMIZATION INTERFACE
==================================================

Create a professional avatar customization interface.

The interface must include:

AVATAR PREVIEW
BODY SETTINGS
MEASUREMENTS
CLOTHING CATEGORIES
SELECTED OUTFIT
SAVE AVATAR
RESET AVATAR

The avatar preview should be the main visual element.

The clothing catalog should be easy to navigate.

Use a responsive layout.

Desktop:

Avatar preview centered.
Clothing catalog beside it.
Measurement panel accessible.

Mobile:

Avatar preview occupies the main area.
Categories remain accessible.
Controls must not cover important body regions.
Clothing selection should work with touch.
Measurement forms should be easy to use.

The interface should feel like a modern fashion application.

Use a clean, premium, minimal design.

Use SURMOI branding.

Avoid excessive animations.

Do not sacrifice usability for visual effects.

==================================================
12. AVATAR INTERACTION TOOLS
==================================================

Implement the following tools and functions.

AVATAR TOOLS:

1. Select avatar.
2. Reset avatar.
3. Save avatar.
4. Load saved avatar.
5. Edit body measurements.
6. Edit body shape.
7. Edit height.
8. Edit weight.
9. Change measurement units.
10. Preview avatar.
11. Restore default values.

CLOTHING TOOLS:

1. Select clothing.
2. Remove clothing.
3. Replace clothing.
4. Change color.
5. Select size.
6. Select size.
7. View product details.
8. View garment measurements.
9. Save outfit.
10. Load outfit.
11. Reset outfit.

RENDERING TOOLS:

1. Render avatar.
2. Render clothing layers.
3. Update clothing alignment.
4. Update body profile.
5. Validate clothing compatibility.
6. Remove duplicate layers.
7. Restore default rendering.

DATA TOOLS:

1. Save avatar profile.
2. Load avatar profile.
3. Update avatar profile.
4. Save outfit.
5. Load outfit.
6. Export avatar configuration.
7. Import avatar configuration.

Implement these as real application functions.

Do not create decorative buttons that do nothing.

==================================================
13. AVATAR STATE MANAGEMENT
==================================================

Create a reliable avatar state management system.

The system must maintain:

* Current avatar.
* Current body measurements.
* Current body shape.
* Selected upper-body clothing.
* Selected lower-body clothing.
* Selected outerwear.
* Selected shoes.
* Selected accessories.
* Current outfit.
* Saved avatar profiles.

Use the existing state management solution if one exists.

If no state management solution exists, choose an appropriate lightweight approach.

The avatar preview must update when state changes.

Do not reload the entire application whenever clothing changes.

Do not lose measurements when switching categories.

Do not reset the avatar when opening the product catalog.

Ensure that saved configurations can be restored correctly.

==================================================
14. AVATAR STORAGE
==================================================

Create a persistent avatar profile system.

Each avatar profile should contain:

* Avatar ID.
* Avatar name.
* Avatar type.
* Base avatar asset.
* Body measurements.
* Body shape.
* Selected clothing.
* Saved outfit.
* Created date.
* Updated date.

Use the existing storage architecture.

If the project uses Supabase, evaluate whether it is appropriate for avatar profile storage.

If the project does not use a backend, implement a temporary local storage approach for the prototype.

Do not store sensitive information unnecessarily.

Body measurements must be treated as personal data.

Do not send measurements to external services without a clear reason.

Do not upload customer photos automatically.

==================================================
15. AI IMAGE GENERATION INTEGRATION
==================================================

The system must be prepared for future AI Virtual Try-On.

Do not make AI generation the core rendering mechanism for the initial avatar system.

Design a separate integration layer for future AI services.

The future AI module may support:

* Customer photo upload.
* Clothing image upload.
* Virtual try-on generation.
* Generated outfit preview.
* Image processing.
* Result storage.

The integration must be optional.

The core avatar system must work without an AI API.

Do not hardcode an AI provider.

Do not invent API keys.

Do not expose API keys in frontend code.

Do not send customer images to external providers without user consent.

Do not claim AI-generated results provide accurate garment fit.

==================================================
16. FUTURE 3D AVATAR SUPPORT
==================================================

Prepare the architecture for future 3D avatar support.

Do not implement a full 3D system unless the existing project already supports it or it is necessary.

Potential future technology:

Three.js
WebGL
GLB / glTF assets
Rigged avatar
Morph targets
3D clothing assets

Future capabilities:

* Rotate avatar.
* Front view.
* Side view.
* Back view.
* Body shape adjustment.
* Clothing visualization.
* Better body proportions.

Keep the avatar profile structure independent from the rendering technology.

A saved avatar profile should not depend entirely on a particular rendering component.

==================================================
17. PERFORMANCE
==================================================

Optimize the avatar system for mobile devices.

The target audience includes Moroccan customers using smartphones.

Requirements:

* Fast initial loading.
* Efficient clothing asset loading.
* No unnecessary re-rendering.
* Responsive images.
* Lazy loading where appropriate.
* Reasonable image dimensions.
* Efficient avatar state updates.
* No excessive API requests.

Avoid loading every clothing asset simultaneously.

Load the selected category and relevant assets.

Do not create a heavy 3D dependency without justification.

==================================================
18. ACCESSIBILITY AND USER EXPERIENCE
==================================================

The avatar system must support:

* Touch controls.
* Keyboard navigation.
* Clear labels.
* Accessible buttons.
* Visible selection states.
* Form validation.
* Loading states.
* Error messages.
* Empty states.
* Reset confirmation where necessary.

Use understandable labels.

Do not make the avatar customization process complicated.

A customer should be able to:

Select avatar
Choose clothing
Preview outfit

without needing to understand technical details.

==================================================
19. TESTING
==================================================

Create tests for the avatar system.

Test:

1. Default avatar loads.
2. Default measurements are correct.
3. Measurements can be edited.
4. Invalid measurements are rejected.
5. Body shape selection works.
6. Clothing can be selected.
7. Clothing layers render correctly.
8. Clothing can be removed.
9. Clothing can be replaced.
10. Outfit can be saved.
11. Outfit can be restored.
12. Avatar can be reset.
13. Mobile interface works.
14. No duplicate clothing layers are created.
15. Avatar identity remains stable.
16. Product IDs remain consistent.

Test the application in the actual development environment.

Do not claim that a feature works if it has not been tested.

==================================================
20. DEVELOPMENT RULES
==================================================

Follow these rules throughout development.

RULE 1:
Inspect the existing code before making changes.

RULE 2:
Preserve existing working features.

RULE 3:
Do not rewrite the entire application unnecessarily.

RULE 4:
Do not create fake functionality.

RULE 5:
Do not use random images as final avatar assets.

RULE 6:
Do not claim exact clothing fit without measurement data.

RULE 7:
Do not generate a new avatar every time clothing changes.

RULE 8:
Do not create buttons without functionality.

RULE 9:
Do not introduce unnecessary dependencies.

RULE 10:
Do not expose secrets or API keys.

RULE 11:
Keep avatar rendering separate from product checkout.

RULE 12:
Keep the architecture compatible with future YouCan integration.

RULE 13:
Use clean, maintainable code.

RULE 14:
Document the avatar asset requirements.

RULE 15:
Explain technical limitations honestly.

==================================================
21. IMPLEMENTATION PRIORITY
==================================================

Follow this order.

PHASE 1 — PROJECT AUDIT

Inspect the existing project.

Identify its current architecture.

Report what already works.

PHASE 2 — AVATAR BASE

Create or integrate the default male avatar.

Ensure consistent proportions and rendering.

PHASE 3 — MEASUREMENT SYSTEM

Implement editable body measurements.

Add default values and validation.

PHASE 4 — CLOTHING RENDERER

Implement clothing layers.

Ensure correct positioning and replacement.

PHASE 5 — AVATAR CUSTOMIZATION

Implement body shape and avatar settings.

PHASE 6 — SAVED AVATARS

Implement persistence.

PHASE 7 — MOBILE EXPERIENCE

Optimize the avatar interface.

PHASE 8 — FUTURE INTEGRATION

Prepare the system for YouCan products and checkout.

Do not skip the foundational phases.

==================================================
22. REQUIRED FINAL DELIVERABLES
==================================================

At the end of implementation, provide:

1. A description of the existing project architecture.
2. A description of the avatar architecture.
3. The default male avatar configuration.
4. The complete body measurement system.
5. The clothing rendering system.
6. The avatar customization interface.
7. The avatar state management system.
8. The storage implementation.
9. The list of implemented tools and functions.
10. The list of files created.
11. The list of files modified.
12. The dependencies added.
13. The tests performed.
14. The remaining technical limitations.
15. The requirements for future 3D or AI Virtual Try-On.
16. The next recommended development phase.

If a feature cannot be implemented because a required asset, API, or dependency is missing, explain the limitation.

Do not pretend that missing functionality is complete.

==================================================
23. FINAL PRODUCT REQUIREMENT
==================================================

The final result must be a functional avatar application, not just a design mockup.

The customer must be able to:

Open the avatar system.
See the default male character.
Customize body measurements.
Select clothing.
See clothing applied to the character.
Build a complete outfit.
Save the avatar configuration.
Return to the saved avatar.

The avatar must remain consistent.

The clothing system must be modular.

The application must be ready for future integration with YouCan.

The primary objective is to build a reliable foundation for SURMOI Virtual Try-On.

Start by auditing the existing project and creating the implementation plan.

Then implement the avatar system step by step.

Do not stop after writing a proposal.

Make the actual code changes when the environment allows it.

Prioritize correctness, realistic proportions, maintainability, and a working avatar experience over unnecessary visual effects.
