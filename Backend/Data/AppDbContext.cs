using Microsoft.EntityFrameworkCore;
using System.Diagnostics.CodeAnalysis;
using Backend.Data.Models;
using Backend.Data.Enumerations;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        //tables
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Backend.Data.Models.Route> Routes { get; set; } = null!;
        public DbSet<Comment> Comments { get; set; } = null!;
        public DbSet<FavoriteRoute> FavoriteRoutes { get; set; } = null!;
        public DbSet<InterestedPlace> InterestedPlaces { get; set; } = null!;
        public DbSet<RouteEvaluation> RouteEvaluations { get; set; } = null!;
        public DbSet<RoutePlace> RoutePlaces { get; set; } = null!;
        public DbSet<VisitedRoute> VisitedRoutes { get; set; } = null!;
        public DbSet<VisitedPlace> VisitedPlaces { get; set; } = null!;
        public DbSet<Follow> Follow { get; set; } = null!;
        public DbSet<Place> Places { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<PlaceCategory> PlaceCategories { get; set; } = null!;
        public DbSet<Period> Periods { get; set; } = null!;

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //modelBuilder.Entity<>().HasOne(b=>b.).WithMany(bi=>bi.).HasForeignKey(ba=>ba.);

            //Comment

            modelBuilder.Entity<Comment>()
            .HasKey(c => new { c.UserName, c.RouteId });

            modelBuilder.Entity<Comment>()
            .HasOne(b => b.User)
            .WithMany(bi => bi.Comments)
            .HasForeignKey(ba => ba.UserName).OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Comment>()
            .HasOne(b => b.Route)
            .WithMany(bi => bi.Comments)
            .HasForeignKey(ba => ba.RouteId);

            //FavoriteRoute

            modelBuilder.Entity<FavoriteRoute>()
            .HasKey(c => new { c.UserName, c.RouteId });

            modelBuilder.Entity<FavoriteRoute>()
            .HasOne(b => b.User)
            .WithMany(bi => bi.FavoriteRoutes)
            .HasForeignKey(ba => ba.UserName).OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<FavoriteRoute>()
            .HasOne(b => b.Route)
            .WithMany(bi => bi.FavoriteRoutes)
            .HasForeignKey(ba => ba.RouteId);

            //RouteEvaluation
            modelBuilder.Entity<RouteEvaluation>()
           .HasKey(c => new { c.UserName, c.RouteId });

            modelBuilder.Entity<RouteEvaluation>()
            .HasOne(b => b.User)
            .WithMany(bi => bi.RouteEvaluations)
            .HasForeignKey(ba => ba.UserName).OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<RouteEvaluation>()
            .HasOne(b => b.Route)
            .WithMany(bi => bi.RouteEvaluations)
            .HasForeignKey(ba => ba.RouteId);

            //RouteVisited
            modelBuilder.Entity<VisitedRoute>()
           .HasKey(c => new { c.UserName, c.RouteId });

            modelBuilder.Entity<VisitedRoute>()
            .HasOne(b => b.User)
            .WithMany(bi => bi.VisitedRoutes)
            .HasForeignKey(ba => ba.UserName).OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<VisitedRoute>()
            .HasOne(b => b.Route)
            .WithMany(bi => bi.RouteVisited)
            .HasForeignKey(ba => ba.RouteId);


            //Follow
            modelBuilder.Entity<Follow>()
           .HasKey(c => new { c.Follower, c.Followed });

            modelBuilder.Entity<Follow>()
            .HasOne(b => b.UserFollower)
            .WithMany(bi => bi.Follow)
            .HasForeignKey(ba => ba.Follower).OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Follow>()
            .HasOne(b => b.UserFollowed)
            .WithMany(bi => bi.Followed)
            .HasForeignKey(ba => ba.Followed).OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Follow>()
            .Property(b => b.State)
            .HasDefaultValue(FollowStatus.Pending);

            //RoutePlace
            modelBuilder.Entity<RoutePlace>()
           .HasKey(c => new { c.PlaceId, c.StartTime, c.RouteId });

            modelBuilder.Entity<RoutePlace>()
              .HasOne(b => b.Route)
              .WithMany(bi => bi.Places)
              .HasForeignKey(ba => ba.RouteId).OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<RoutePlace>()
             .HasOne(b => b.Place)
             .WithMany(bi => bi.RoutePlaces)
             .HasForeignKey(ba => ba.PlaceId).OnDelete(DeleteBehavior.NoAction);

            //InterestedPlace
            modelBuilder.Entity<InterestedPlace>()
           .HasKey(c => new { c.PlaceId, c.UserName });

            modelBuilder.Entity<InterestedPlace>()
            .HasOne(b => b.User)
            .WithMany(bi => bi.InterestedPlaces)
            .HasForeignKey(ba => ba.UserName).OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<InterestedPlace>()
            .HasOne(b => b.Place)
            .WithMany(bi => bi.InterestedPlaces)
            .HasForeignKey(ba => ba.PlaceId).OnDelete(DeleteBehavior.NoAction);

            //VisitedPlace
            modelBuilder.Entity<VisitedPlace>()
           .HasKey(c => new { c.PlaceId, c.UserName });

            modelBuilder.Entity<VisitedPlace>()
             .HasOne(b => b.User)
             .WithMany(bi => bi.VisitedPlaces)
             .HasForeignKey(ba => ba.UserName).OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<VisitedPlace>()
           .HasOne(b => b.Place)
           .WithMany(bi => bi.VisitedPlaces)
           .HasForeignKey(ba => ba.PlaceId).OnDelete(DeleteBehavior.NoAction);


            //Route
            modelBuilder.Entity<Backend.Data.Models.Route>()
            .HasOne(b => b.User)
            .WithMany(bi => bi.Routes)
            .HasForeignKey(ba => ba.UserName).OnDelete(DeleteBehavior.NoAction);

            //Place
            modelBuilder.Entity<Place>()
            .Property(b => b.AverageVisitTime)
            .HasDefaultValue(60);

            //Category

            //PlaceCategory

            modelBuilder.Entity<PlaceCategory>()
           .HasKey(c => new { c.PlaceId, c.CategoryId });

            modelBuilder.Entity<PlaceCategory>()
            .HasOne(b => b.Category)
            .WithMany(bi => bi.PlaceCategories)
            .HasForeignKey(ba => ba.CategoryId).OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<PlaceCategory>()
            .HasOne(b => b.Place)
            .WithMany(bi => bi.Categories)
            .HasForeignKey(ba => ba.PlaceId).OnDelete(DeleteBehavior.NoAction);

            //Period
            modelBuilder.Entity<Period>()
           .HasKey(c => new { c.PlaceId, c.OpenDay, c.OpenTime });

            modelBuilder.Entity<Period>()
            .HasOne(b => b.Place)
            .WithMany(bi => bi.Periods)
            .HasForeignKey(ba => ba.PlaceId).OnDelete(DeleteBehavior.NoAction);
        }


    }

}
