import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ProfileService } from '../../routes/profile/profile.service';
import { Profile } from '../database/entities/profile.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly profileService: ProfileService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not found');
    }

    const [type, credentials] = authHeader.split(' ');

    if (type !== 'Basic') {
      throw new UnauthorizedException('Authentication type not supported');
    }

    const decodedCredentials = Buffer.from(credentials, 'base64').toString(
      'utf8'
    );
    const [username, password] = decodedCredentials.split(':');

    if (!username || !password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user: Profile = await this.profileService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    request.user = user;
    return true;
  }
}
