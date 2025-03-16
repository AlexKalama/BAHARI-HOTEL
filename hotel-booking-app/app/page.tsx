import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-black text-white py-24 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">La Safari Hotel</h1>
          <h2 className="text-xl md:text-2xl font-medium mb-8">Where Luxury Meets Adventure</h2>
          <p className="max-w-lg mx-auto text-gray-300 mb-10">
            Welcome to La Safari Hotel! Located in the beautiful coastal city of Mombasa, Kenya, 
            we offer a unique blend of comfort and serenity. Immerse yourself in the vibrant culture, 
            stunning landscapes, and warm hospitality that make us a perfect getaway.
          </p>
          <Link href="/reservations">
            <Button size="lg" className="bg-yellow-700 hover:bg-yellow-800">
              Book Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-16 bg-yellow-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-yellow-900 mb-10 text-center">
            Our Amenities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Restaurant & Bar",
                description: "Enjoy fine dining and refreshing beverages in our elegant restaurant and bar.",
                image: "/images/Restaurant.jpg",
              },
              {
                title: "Spa",
                description: "Indulge in a soothing retreat at our spa, offering a range of rejuvenating treatments.",
                image: "/images/spa.jpg",
              },
              {
                title: "Event Spaces",
                description: "Make lasting memories in our large versatile event spaces, perfect for any occasion.",
                image: "/images/event-spaces.jpg",
              },
              {
                title: "Pools",
                description: "Experience tranquility in our captivating pools, ideal for a rejuvenating swim.",
                image: "/images/pools.jpg",
              },
              {
                title: "Accommodations",
                description: "Unwind in our plush accommodations, thoughtfully designed for your comfort and relaxation.",
                image: "/images/rooms.jpg",
              },
              {
                title: "Recreation & Activities",
                description: "Engage in a variety of fun-filled recreational activities, designed for your entertainment and leisure.",
                image: "/images/recreation.jpg",
              },
            ].map((amenity, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <Image
                    src={amenity.image}
                    alt={amenity.title}
                    width={500}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <CardTitle className="mb-2">{amenity.title}</CardTitle>
                  <CardDescription>{amenity.description}</CardDescription>
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" className="text-yellow-800 border-yellow-800 hover:bg-yellow-50">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-2/3">
              <h2 className="text-4xl font-bold mb-6">How can we help you?</h2>
              <p className="text-gray-400 mb-8 md:mb-0 md:pr-8">
                For any inquiries or assistance, please don't hesitate to reach out to us. We're here to help!
              </p>
            </div>
            <div>
              <Link href="/contact">
                <Button size="lg" className="bg-yellow-700 hover:bg-yellow-600">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}