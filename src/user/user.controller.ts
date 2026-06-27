import { Controller, Get, Req, UseGuards } from '@nestjs/common'; // <-- Added UseGuards here
import { AuthGuard } from '@nestjs/passport'; // Ensure you are importing AuthGuard as well
import { Request } from 'express'; // Import Request type from express

@Controller('users')
export class UserController {
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Req() req: Request) {
    console.log({ 'who tf is this guy?': req.user });
    return 'who tf is this guy?';
  }
}
