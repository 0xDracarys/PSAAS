import { NextResponse } from 'next/server';
import { dbService } from '@/lib/database-service';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { currentPassword, newPassword, email } = await request.json();

    if (!currentPassword || !newPassword || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const admin = await dbService.getAdminUser(email);

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin user not found' },
        { status: 404 }
      );
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await dbService.updateAdminPassword(email, hashedPassword);

    return NextResponse.json(
      { message: 'Password updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}