import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PageLoader from "../components/Loaders/PageLoader";
import { useSetUserState } from "../features/user/atom";
import { authInitState, useAuthState } from "../features/auth/atom";
import { fetchUserProfile } from "../features/user/actions";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const [authState, setAuthState] = useAuthState();

  const setUserState = useSetUserState();

  const navigate = useNavigate();

  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile()
      .then((data: any) => {
        setUserState((state) => {
          const user = data?.user;

          return {
            ...state,
            userData: {
              id: user?._id,
              email: user?.email,
              phoneNumber: user?.phoneNumber,
              role: user?.role,
              fullname: user?.fullname,
              firstname: user?.fullname.split(" ")[1],
              profileImageURL: user?.profileImageURL,
              newProfileImage: "",
              bank: {
                name: user.bank?.name,
                accountNumber: user.bank?.accountNumber,
                accountName: user.bank?.accountName,
              },
              adminProperties: {
                transactionFilterOptions: {
                  status:
                    user.adminProperties.transactions.filterOptions?.status,
                  startDate:
                    user.adminProperties.transactions.filterOptions?.startDate,
                  endDate:
                    user.adminProperties.transactions.filterOptions?.endDate,
                },
              },
            },
          };
        });
      })
      .catch((error) => {
        setAuthState(authInitState);
        if (error.code === 401) navigate({ pathname: "/" });
      })
      .finally(() => setIsLoading(false));
  }, [
    authState.isSignedIn,
    location.pathname,
    navigate,
    setAuthState,
    setUserState,
  ]);

  if (isLoading) return <PageLoader />;
  else return children;
}
