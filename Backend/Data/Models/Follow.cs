using Backend.Data.Enumerations;

namespace Backend.Data.Models
{
    public class Follow
    {

        public Follow(string follower, string followed, FollowStatus state)
        {
            Follower = follower;
            UserFollower = null!;
            Followed = followed;
            UserFollowed = null!;
            State = state;
        }

        public FollowStatus State { get; set; }

        //Navigations Properties


        public string Follower { get; set; }//foreignKey   
        public virtual User UserFollower { get; set; }//foreignKey           

        public string Followed { get; set; }//foreignKey   
        public virtual User UserFollowed { get; set; }//foreignKey           

    }
}