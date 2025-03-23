import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function getNotifications() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { error: "Unauthorized", notifications: [] };
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { isRead: "asc" },
        { createdAt: "desc" },
      ],
    });

    return { notifications };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { error: "Error fetching notifications", notifications: [] };
  }
}
