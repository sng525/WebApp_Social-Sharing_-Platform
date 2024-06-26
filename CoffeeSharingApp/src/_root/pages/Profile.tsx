import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import { Link, useParams } from "react-router-dom";
import GrindPostList from "./GrindPostList";

const Profile = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { data: currentUser, isPending } = useGetUserById(id || '')

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <img
          src={currentUser?.imageUrl || "../assets/images/profile-default.png"}
          alt="profile"
          width={200}
          height={200}
          className="aspect-square rounded-full"
        />
        <div className="flex flex-col px-5">
          <div className="flex flex-row items-center space-x-6">
            <h1 className="h1-bold md:h2 bold text-left w-full whitespace-nowrap">{currentUser?.name}</h1>
            <Link
              to={`/update-profile/${currentUser?.$id}`}
              className="w-full">
              <div className={`${user.id !== id && "hidden"}`}>
                <Button type="button" className="shad-button_dark_4">
                  <img src="../assets/icons/edit.svg" width={20} height={20} />
                  <p>Edit Profile</p>
                </Button>
              </div>
            </Link>

            <div className={`${user.id === id && "hidden"}`}>
              <Button type="button" className="shad-button_dark_4">
                Follow
              </Button>
            </div>
          </div>

          <p className="text-sm">@{currentUser?.username}</p>

          <div className="grid grid-cols-3 py-5">
            <div>
              <p className="text-xl text-blue-700">{currentUser?.posts.length}</p>
              <p>Posts</p>
            </div>
            <div>
              <p className="text-xl text-blue-700">15</p>
              <p>Followers</p>
            </div>
            <div>
              <p className="text-xl text-blue-700">15</p>
              <p>Following</p>
            </div>
          </div>
          <div>
            <p>{currentUser?.bio}</p>
          </div>
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl">
        <h3 className="body-bold md:h3-bold">Posts</h3>
        <div className="flex-center gap3 bg-slate-300 rounded-x1 px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-dark-3">All</p>
          <img
            src="../assets/icons/filter.svg"
            width={20}
            height={20}
            alt="filter"
          />
        </div>
      </div>
      <div>
        <ul className="save-card">
          <GrindPostList posts={currentUser?.posts} showUser={false} showStats={false} />
        </ul>
      </div>


    </div>
  );
};

export default Profile;