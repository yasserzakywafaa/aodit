import { Avatar, Badge } from "@mui/material";

import { AvatarSquareStyle } from "src/application/shared/themes";
import { User } from "src/shared/types/user";
import { VerifiedBadge } from "./Badges/VerifiedBadge";

export interface ProfileAvatarProps {
  user: User;
  avatarSize?: { width: number; height: number };
  verifiedBadgeSize?: number;
}

const ProfileAvatar = (props: ProfileAvatarProps) => {
  const { user, avatarSize, verifiedBadgeSize } = props;

  if (!user) return <></>;

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
          {(user.name.givenName && user.name.givenName.charAt(0)) || ""}
          {(user.name.familyName && user.name.familyName.charAt(0)) || ""}
        </Avatar>
      )}
    </Badge>
  );
};

export default ProfileAvatar;
