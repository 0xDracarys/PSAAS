import { NextResponse } from 'next/server'
import { dbService } from '@/lib/database-service'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, currentPassword, newPassword } = body

    // Validation
    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: 'New password must be different from current password' },
        { status: 400 }
      )
    }

    // Verify current password. dbService.verifyAdminPassword uses username or email
    // However, json db verifyAdminPassword requires the exact username. 
    // We will get the admin user by email/username first.
    let isValidPassword = false;
    
    // Fallback checking since we've refactored dbService to support fallback
    // We'll try to get user by the identifier (email/username)
    const admin = await dbService.getAdminUserByUsername(email);
    
    if (!admin) {
       return NextResponse.json(
         { error: 'Admin user not found' },
         { status: 404 }
       )
    }
    
    isValidPassword = await bcrypt.compare(currentPassword, admin.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      )
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12)
    const newPasswordHash = await bcrypt.hash(newPassword, salt)

    // Update password via dbService
    const success = await dbService.updateAdminPassword(email, newPasswordHash)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    )
  }
}
