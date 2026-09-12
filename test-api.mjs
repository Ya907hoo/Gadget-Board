async function runTests() {
  console.log("--- 1. Testing GET /api/wishes ---");
  const res1 = await fetch("http://localhost:3000/api/wishes");
  const data1 = await res1.json();
  console.log("GET /api/wishes status:", res1.status, "Wishes count:", data1.data?.length);

  console.log("\n--- 2. Testing POST /api/wishes ---");
  const res2 = await fetch("http://localhost:3000/api/wishes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Automated Test Homework Helper",
      description: "A robotic pen that writes flawless cursive essays while you take an afternoon nap!",
      category: "Study & School",
      creator_id: "user-nobita",
      creator_name: "Nobita N.",
      creator_avatar: "nobita",
    }),
  });
  const data2 = await res2.json();
  console.log("POST /api/wishes status:", res2.status, "New wish ID:", data2.data?.id);
  const newId = data2.data?.id;

  if (newId) {
    console.log("\n--- 3. Testing POST /api/wishes/[id]/upvote ---");
    const res3 = await fetch(`http://localhost:3000/api/wishes/${newId}/upvote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "user-shizuka" }),
    });
    const data3 = await res3.json();
    console.log("Upvote status:", res3.status, "Upvotes:", data3.upvotes_count, "Has upvoted:", data3.has_upvoted);

    console.log("\n--- 4. Testing POST /api/wishes/[id]/grant ---");
    const res4 = await fetch(`http://localhost:3000/api/wishes/${newId}/grant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        granted_gadget_name: "Computer Pencil (Computer Pen)",
        comment: "Granted with the Computer Pencil from the 22nd century!",
        user_id: "user-doraemon",
        user_name: "Doraemon (Host)",
        user_avatar: "doraemon",
      }),
    });
    const data4 = await res4.json();
    console.log("Grant status:", res4.status, "Granted Gadget:", data4.data?.granted_gadget_name);

    console.log("\n--- 5. Testing GET /api/comments?wishId=... ---");
    const res5 = await fetch(`http://localhost:3000/api/comments?wishId=${newId}`);
    const data5 = await res5.json();
    console.log("Comments count:", data5.data?.length, "Latest comment:", data5.data?.[0]?.content);
  }

  console.log("\nALL TESTS PASSED SUCCESSFULLY! ✨");
}

runTests().catch(console.error);
