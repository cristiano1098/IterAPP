using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    public partial class ThirdMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BusinessStatus",
                table: "Places",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "Places",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                table: "Places",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Places",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "Rating",
                table: "Places",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserRatingsTotal",
                table: "Places",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    CategoryId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.CategoryId);
                });

            migrationBuilder.InsertData(
               table: "Categories",
               columns: new[] { "CategoryId" },
               values: new object[,]
               {
                    {"Licensed Cotton Shirt" },
                    {"accounting" },
                    {"airport" },
                    {"amusement_park" },
                    {"aquarium" },
                    {"art_gallery" },
                    {"atm" },
                    {"bakery" },
                    {"bank" },
                    {"bar" },
                    {"beauty_salon" },
                    {"bicycle_store" },
                    {"book_store" },
                    {"bowling_alley" },
                    {"bus_station" },
                    {"cafe" },
                    {"campground" },
                    {"car_dealer" },
                    {"car_rental" },
                    {"car_repair" },
                    {"car_wash" },
                    {"casino" },
                    {"cemetery" },
                    {"church" },
                    {"city_hall" },
                    {"clothing_store" },
                    {"convenience_store" },
                    {"courthouse" },
                    {"dentist" },
                    {"department_store" },
                    {"doctor" },
                    {"electrician" },
                    {"electronics_store" },
                    {"embassy" },
                    {"establishment" },
                    {"finance" },
                    {"fire_station" },
                    {"florist" },
                    {"food" },
                    {"funeral_home" },
                    {"furniture_store" },
                    {"gas_station" },
                    {"general_contractor" },
                    {"grocery_or_supermarket" },
                    {"gym" },
                    {"hair_care" },
                    {"hardware_store" },
                    {"health" },
                    {"hindu_temple" },
                    {"home_goods_store" },
                    {"hospital" },
                    {"insurance_agency" },
                    {"jewelry_store" },
                    {"laundry" },
                    {"lawyer" },
                    {"library" },
                    {"liquor_store" },
                    {"local_government_office" },
                    {"locksmith" },
                    {"lodging" },
                    {"meal_delivery" },
                    {"meal_takeaway" },
                    {"mosque" },
                    {"movie_rental" },
                    {"movie_theater" },
                    {"moving_company" },
                    {"museum" },
                    {"night_club" },
                    {"painter" },
                    {"park" },
                    {"parking" },
                    {"pet_store" },
                    {"pharmacy" },
                    {"physiotherapist" },
                    {"place_of_worship" },
                    {"plumber" },
                    {"police" },
                    {"post_office" },
                    {"real_estate_agency" },
                    {"restaurant" },
                    {"roofing_contractor" },
                    {"rv_park" },
                    {"school" },
                    {"shoe_store" },
                    {"shopping_mall" },
                    {"spa" },
                    {"stadium" },
                    {"storage" },
                    {"store" },
                    {"subway_station" },
                    {"synagoguevtaxi_stand" },
                    {"train_station" },
                    {"travel_agency" },
                    {"university" },
                    {"veterinary_care" },
                    {"zoo"}

               });

            migrationBuilder.CreateTable(
                name: "Periods",
                columns: table => new
                {
                    OpenDay = table.Column<int>(type: "int", nullable: false),
                    OpenTime = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PlaceId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CloseDay = table.Column<int>(type: "int", nullable: false),
                    CloseTime = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Periods", x => new { x.PlaceId, x.OpenDay, x.OpenTime });
                    table.ForeignKey(
                        name: "FK_Periods_Places_PlaceId",
                        column: x => x.PlaceId,
                        principalTable: "Places",
                        principalColumn: "PlaceId");
                });

            migrationBuilder.CreateTable(
                name: "PlaceCategories",
                columns: table => new
                {
                    CategoryId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PlaceId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlaceCategories", x => new { x.PlaceId, x.CategoryId });
                    table.ForeignKey(
                        name: "FK_PlaceCategories_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "CategoryId");
                    table.ForeignKey(
                        name: "FK_PlaceCategories_Places_PlaceId",
                        column: x => x.PlaceId,
                        principalTable: "Places",
                        principalColumn: "PlaceId");
                });

            migrationBuilder.Sql("DELETE FROM Comments", true);
            migrationBuilder.Sql("DELETE FROM FavoriteRoutes", true);
            migrationBuilder.Sql("DELETE FROM VisitedRoutes", true);
            migrationBuilder.Sql("DELETE FROM InterestedPlaces", true);
            migrationBuilder.Sql("DELETE FROM RouteEvaluations", true);
            migrationBuilder.Sql("DELETE FROM RoutePlaces", true);
            migrationBuilder.Sql("DELETE FROM Routes", true);
            migrationBuilder.Sql("DELETE FROM VisitedPlaces", true);

            migrationBuilder.CreateIndex(
                name: "IX_PlaceCategories_CategoryId",
                table: "PlaceCategories",
                column: "CategoryId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Periods");

            migrationBuilder.DropTable(
                name: "PlaceCategories");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropColumn(
                name: "BusinessStatus",
                table: "Places");

            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Places");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Places");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Places");

            migrationBuilder.DropColumn(
                name: "Rating",
                table: "Places");

            migrationBuilder.DropColumn(
                name: "UserRatingsTotal",
                table: "Places");
        }
    }
}
