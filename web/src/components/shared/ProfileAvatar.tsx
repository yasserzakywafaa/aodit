import { Avatar, Badge } from "@mui/material";
import { PersonOutlined } from "@mui/icons-material";

import { AvatarSquareStyle } from "src/application/shared/themes";
import { User } from "src/shared/types/user";
import { VerifiedBadge } from "./Badges/VerifiedBadge";
import { getUserAvatarInitials } from "src/shared/utils/getUserDisplayName";

export interface ProfileAvatarProps {
  user: User;
  avatarSize?: { width: number; height: number };
  verifiedBadgeSize?: number;
}

const ProfileAvatar = (props: ProfileAvatarProps) => {
  const { user, avatarSize, verifiedBadgeSize } = props;

  if (!user) return <></>;

  const initials = getUserAvatarInitials(user);

  return (
    <Badge
      overlap="circular"
      badgeContent={
        user.isPaidUser && <VerifiedBadge fontSize={verifiedBadgeSize} />
      }
    >
      {user.picture ? (
        <Avatar
          variant="square"
          alt="User Picture"
          src={user.picture}
          sx={{
            ...AvatarSquareStyle,
            width: avatarSize?.width,
            height: avatarSize?.height,
          }}
        />
      ) : (
        <Avatar
          variant="square"
          sx={{
            ...AvatarSquareStyle,
            mr: 1,
            width: avatarSize?.width,
            height: avatarSize?.height,
          }}
        >
          {initials || (
            <PersonOutlined
              sx={{ fontSize: Math.max(14, (avatarSize?.width ?? 24) * 0.55) }}
            />
          )}
        </Avatar>
      )}
    </Badge>
  );
};

export default ProfileAvatar;
