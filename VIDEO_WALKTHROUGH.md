# 🎥 Screen Recording Walkthrough Guide (60-90 Seconds)

This guide provides a step-by-step walkthrough script to record the video demonstrating shared data mutations and real-time interactions for evaluation.

---

## 🖥️ Recording Setup

1. Open two browser windows side-by-side:
   - **Left Window:** Persona **Nobita N.** (Window A)
   - **Right Window:** Persona **Shizuka M.** or **Doraemon** (Window B)
2. Open `http://localhost:3000` (or your deployed Vercel URL) in both windows.

---

## 🎬 90-Second Walkthrough Script

### Scene 1: The Doraemon Light-Mode Aesthetic & Animations (15 sec)
1. Show the clean, light-mode palette:
   - Sky-blue header with spinning bamboo-copter propeller.
   - Playful stats cards and rounded 4D pocket card design.
2. Filter categories by clicking **"Travel & Time"** or **"Food & Dorayaki"** — highlight the smooth **staggered card entrance animation**.
3. Toggle between **"All"**, **"Active Wishes"**, and **"Granted"** statuses to show instant layout reflow.

---

### Scene 2: Interactive Upvoting with Floating "+1" Particle (15 sec)
1. In Window A (Nobita), hover over the upvote button on any wish — point out the smooth hover spring.
2. Click the upvote button:
   - Watch the button bounce/scale pop.
   - Point out the floating **`+1 ✨` micro-particle** rising and fading.
3. Observe Window B (Shizuka):
   - Notice the upvote count instantly synchronizes across both windows in real time!
4. Click again to show toggleability (removes vote gracefully).

---

### Scene 3: Posting a New Wish (20 sec)
1. In Window A (Nobita), click the red **"Make a Wish"** button.
2. Notice the spring scale-in dialog and backdrop blur.
3. Submit an empty form to show the **animated validation error shake** and red warning badges.
4. Fill in:
   - **Title:** `Never Forget My Homework Again`
   - **Category:** `Study & School`
   - **Description:** `Every time the teacher walks into class, I realize my math worksheet is sitting on my desk at home. I need a pocket portal directly to my desk!`
   - Pick a preset photo thumbnail.
5. Click **"Post Wish Idea"**.
6. Watch the card smoothly animate into the grid on Window A **and** immediately appear on Window B!

---

### Scene 4: Creator Permissions & Ownership (15 sec)
1. In Window A (Nobita - Creator):
   - Click the three-dots menu on the new wish.
   - Notice that **"Edit Wish"** and **"Delete"** are fully available.
2. In Window B (Shizuka - Collaborator):
   - Click the three-dots menu on the same wish or open detail modal.
   - Point out that edit/delete controls are restricted to the creator only.

---

### Scene 5: Brainstorming & Granting with Confetti Celebration (25 sec)
1. In Window B (Shizuka/Doraemon), click on Nobita's new wish to open the **Wish & Gadget Solution Hub** modal.
2. Post a gadget comment:
   - Check `Suggest a 22nd-Century Gadget Solution`.
   - Enter Gadget Name: `Desk Fetching Pouch`.
   - Content: `Keep one pouch on your desk and one in your backpack!`.
   - Click **Send**.
3. Now click **"Help Grant Wish ✨"**:
   - Select or type `Dokodemo Desk Portal`.
   - Click **"Celebrate & Grant Wish!"**.
4. **The Big Climax:**
   - Watch the **confetti explosion** burst in vibrant Doraemon colors (gold, sky-blue, red)!
   - See the card transition into a **golden shimmer banner** with the bell icon.
   - Both Window A and Window B now reflect the granted state!
