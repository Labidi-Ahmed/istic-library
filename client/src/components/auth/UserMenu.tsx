import {LogOut, Loader2} from 'lucide-react';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {useUserStore} from '@/stores/userStore';
import useLogout from '@/hooks/auth/useLogout';

export function UserMenu() {
  const {user} = useUserStore();
  const {logout, logoutLoading} = useLogout();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.picture} />
          <AvatarFallback>
            {user.username ? user.username.slice(0, 1).toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56   rounded-xl p-2 ">
        <DropdownMenuLabel className="font-normal text-sm text-muted-foreground">
          <span>{user.email}</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuGroup></DropdownMenuGroup>
        <DropdownMenuItem
          onClick={() => {
            logout();
          }}
          disabled={logoutLoading}
          className="relative "
        >
          {logoutLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4 " />
          )}
          <span className="">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
