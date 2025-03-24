export async function getUser(userId:string) {
    try {
        const user = await fetch(`/api/users/${userId}/profile`);
        if (!user.ok) {
            throw new Error(`Failed to fetch user`);
        }
        const data = await user.json();
        console.log("User data:", data);
        return data;
    } catch (error) {
        console.error("Error fetching user:", error);
        return { error: "Error fetching user" };
    }
}
