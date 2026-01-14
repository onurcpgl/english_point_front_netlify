import Talking from "../../components/talking/Talking";
import HomeBannerSecond from "../../components/homeBanner/HomeBannerSecond";
import HowItWorks from "../../components/howItWorks/HowItWorks";
import SpeechBlock from "../../components/speechblock/SpeechBlock";
export default function Home() {
  return (
    <div className="bg-white">
      <HomeBannerSecond />
      <Talking />
      <HowItWorks />
      <SpeechBlock />
    </div>
  );
}
