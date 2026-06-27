import { Controller, Get, Req, UseGuards } from '@nestjs/common'; // <-- Added UseGuards here
import { AuthGuard } from '@nestjs/passport'; // Ensure you are importing AuthGuard as well
import { Request } from 'express'; // Import Request type from express

@Controller('users')
export class UserController {
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Req() req: Request) {
    return req.user; // This will return the user object attached to the request by the JwtStrategy
  }
}
