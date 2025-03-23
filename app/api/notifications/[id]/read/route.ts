import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const notificationId = params.id

  try {
    // Verificar que la notificación pertenece al usuario
    const notification = await prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    })

    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }

    if (notification.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Marcar como leída
    await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return NextResponse.json({ error: "Error marking notification as read" }, { status: 500 })
  }
}



// import { NextRequest, NextResponse } from "next/server";
// import { markNotificationAsRead } from "@/lib/notifications";

// export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
//   const { id } = params;

//   try {
//     const updatedNotification = await markNotificationAsRead(id);
//     return NextResponse.json(updatedNotification);
//   } catch (error) {
//     return NextResponse.json({ error: "Error updating notification" }, { status: 500 });
//   }
// }
