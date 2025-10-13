import SearchJob from "../../components/SearchJob";
import FeaturedJobs from "../../components/FeaturedJobs";
import FeaturedCompanies from "../../components/FeaturedCompanies";
import Testimonials from "../../components/Testimonials";
function Home() {
  return (
    <div>
      <SearchJob />
      <FeaturedJobs />
      <FeaturedCompanies />
      <Testimonials />
    </div>
  );
}
export default Home;
