using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    public partial class SecondMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RoutePlaces_Routes_RouteId",
                table: "RoutePlaces");

            migrationBuilder.AddColumn<int>(
                name: "State",
                table: "Follow",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AlterColumn<int>(
            name: "State",
            table: "Follow",
            type: "int",
            nullable: false,
            defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Places",
                columns: table => new
                {
                    PlaceId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    AverageVisitTime = table.Column<int>(type: "int", nullable: false, defaultValue: 60)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Places", x => x.PlaceId);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_InterestedPlaces_Places_PlaceId",
                table: "InterestedPlaces",
                column: "PlaceId",
                principalTable: "Places",
                principalColumn: "PlaceId");

            migrationBuilder.AddForeignKey(
                name: "FK_RoutePlaces_Places_PlaceId",
                table: "RoutePlaces",
                column: "PlaceId",
                principalTable: "Places",
                principalColumn: "PlaceId");

            migrationBuilder.AddForeignKey(
                name: "FK_RoutePlaces_Routes_RouteId",
                table: "RoutePlaces",
                column: "RouteId",
                principalTable: "Routes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_VisitedPlaces_Places_PlaceId",
                table: "VisitedPlaces",
                column: "PlaceId",
                principalTable: "Places",
                principalColumn: "PlaceId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InterestedPlaces_Places_PlaceId",
                table: "InterestedPlaces");

            migrationBuilder.DropForeignKey(
                name: "FK_RoutePlaces_Places_PlaceId",
                table: "RoutePlaces");

            migrationBuilder.DropForeignKey(
                name: "FK_RoutePlaces_Routes_RouteId",
                table: "RoutePlaces");

            migrationBuilder.DropForeignKey(
                name: "FK_VisitedPlaces_Places_PlaceId",
                table: "VisitedPlaces");

            migrationBuilder.DropTable(
                name: "Places");

            migrationBuilder.DropColumn(
                name: "State",
                table: "Follow");

            migrationBuilder.AddForeignKey(
                name: "FK_RoutePlaces_Routes_RouteId",
                table: "RoutePlaces",
                column: "RouteId",
                principalTable: "Routes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
