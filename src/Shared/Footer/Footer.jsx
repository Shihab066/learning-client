import MailIcon from "../../components/Icons/MailIcon";
import PhoneIcon from "../../components/Icons/PhoneIcon";
import LocationIcon from "../../components/Icons/LocationIcon";

const Footer = () => {
    return (
        <footer className="bg-black mt-20 sm:mt-28 md:mt-36 lg:mt-40">
            <div className="lg-container footer pt-12 pb-10 pl-6 sm:p-10 text-white text-opacity-70 font-medium sm:grid-cols-2 md:flex md:justify-between md:flex-wrap">
                {/* Company Info Section */}
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white opacity-90">Learning Point</h2>
                    <p>Learning Point Ltd.<br />Best learning platform</p>
                    {/* Social Media Icons */}
                    <div className="flex gap-x-2 mt-2">
                        {/* Facebook */}
                        <a href="#">
                            <div className="bg-[#1877f2] p-[7px] rounded hover:opacity-80 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="white" width="22" height="22" aria-hidden="true">
                                    <path d="M501 257.5c0-135.3-109.7-245-245-245S11 122.2 11 257.5c0 122.3 89.6 223.6 206.7 242V328.3h-62.2v-70.8h62.2v-54c0-61.4 36.6-95.3 92.5-95.3 26.8 0 54.8 4.8 54.8 4.8v60.3h-30.9c-30.4 0-39.9 18.9-39.9 38.3v46h67.9l-10.9 70.8h-57.1v171.2C411.4 481.1 501 379.8 501 257.5"></path>
                                </svg>
                            </div>
                        </a>
                        {/* X (Twitter) */}
                        <a href="#">
                            <div className="bg-white p-[10px] rounded hover:opacity-80 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="black" width="15" height="15" viewBox="0 0 512 512" aria-hidden="true">
                                    <path d="M298.158 216.797 484.663 0h-44.196L278.525 188.242 149.182 0H0l195.592 284.655L0 512h44.198l171.016-198.79L351.809 512h149.182L298.147 216.797zm-60.536 70.366-19.818-28.345L60.124 33.272h67.885L255.26 215.295l19.817 28.345 165.411 236.601h-67.886l-134.98-193.067z"></path>
                                </svg>
                            </div>
                        </a>
                        {/* YouTube */}
                        <a href="#">
                            <div className="bg-[#bb0000] p-[7px] rounded hover:opacity-80 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 360" fill="white" width="22" height="22" aria-hidden="true">
                                    <path d="M353.49 95.037c-4.393-19.115-20.029-33.214-38.848-35.312-62.031-6.931-206.396-7.014-269.18 0-18.816 2.098-34.445 16.197-38.845 35.312-8.847 38.526-8.776 132.054-.068 169.923 4.393 19.118 20.021 33.21 38.841 35.315 62.031 6.931 206.396 7.014 269.18 0 18.816-2.105 34.452-16.197 38.852-35.315 8.703-37.895 8.815-131.88.068-169.923M145.003 211.903v-63.809c0-11.344 12.28-18.434 22.105-12.762l55.261 31.906c9.824 5.672 9.824 19.852 0 25.524l-55.261 31.903c-9.825 5.672-22.105-1.418-22.105-12.762"></path>
                                </svg>
                            </div>
                        </a>
                        {/* LinkedIn */}
                        <a href="#">
                            <div className="bg-[#0a66c2] p-[9px] rounded hover:opacity-80 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="white" width="18" height="18" aria-hidden="true">
                                    <path d="M436.2 436.3h-75.9V317.4c0-28.3-.5-64.8-39.5-64.8-39.5 0-45.6 30.9-45.6 62.7v120.9h-75.9V191.9h72.8v33.4h1c7.3-12.5 17.8-22.7 30.5-29.7 12.7-6.9 27-10.3 41.4-9.8 76.9 0 91.1 50.6 91.1 116.4zM113.9 158.5c-8.7 0-17.2-2.6-24.5-7.4-7.2-4.8-12.9-11.7-16.2-19.8s-4.2-16.9-2.5-25.4c1.7-8.5 5.9-16.4 12-22.5 6.2-6.2 14-10.4 22.5-12.1 8.5-1.7 17.4-.8 25.4 2.5s14.9 9 19.8 16.2c4.8 7.2 7.4 15.7 7.4 24.5 0 5.8-1.1 11.5-3.3 16.8-2.2 5.3-5.5 10.2-9.5 14.3-4.1 4.1-8.9 7.3-14.3 9.5-5.3 2.3-11 3.4-16.8 3.4m37.9 277.8H75.9V191.9h75.9zM474.1 0H37.8c-9.9-.1-19.4 3.7-26.5 10.6S.1 27 0 36.9V475c.1 9.9 4.2 19.4 11.2 26.3 7.1 6.9 16.6 10.8 26.5 10.7H474c9.9.1 19.5-3.7 26.6-10.6 7.1-6.9 11.2-16.4 11.3-26.3V36.9c-.1-9.9-4.2-19.4-11.3-26.3S484-.1 474.1 0"></path>
                                </svg>
                            </div>
                        </a>
                    </div>
                </div>

                {/* Contact Information Section */}
                <div>
                    <span className="footer-title text-white opacity-90">Contact us</span>
                    <a className="link link-hover flex items-center gap-1">
                        <MailIcon /> info@learningpoint.com
                    </a>
                    <a className="link link-hover flex items-center gap-1">
                        <PhoneIcon /> +1 (587) 853-4367
                    </a>
                    <a className="link link-hover flex items-center gap-1">
                        <PhoneIcon /> (465) 867-5309
                    </a>
                </div>

                {/* Company Links Section */}
                <div>
                    <span className="footer-title text-white opacity-90">Company</span>
                    <a className="link link-hover">About us</a>
                    <a className="link link-hover">Contact</a>
                    <a className="link link-hover">Jobs</a>
                    <a className="link link-hover">FAQ</a>
                </div>

                {/* Legal Links Section */}
                <div>
                    <span className="footer-title text-white opacity-90">Legal</span>
                    <a className="link link-hover">Terms of use</a>
                    <a className="link link-hover">Privacy policy</a>
                    <a className="link link-hover">Cookie policy</a>
                    <a className="link link-hover">Copyright information</a>
                </div>

                {/* Address Section */}
                <div>
                    <span className="footer-title text-white opacity-90">Address</span>
                    <a className="link link-hover flex items-start mb-2">
                        <LocationIcon /> San Francisco,CA 94107
                    </a>
                    <a className="link link-hover flex items-start">
                        <LocationIcon /> Pine Avenue, Brooklyn, <br /> NY 10001, United States
                    </a>
                </div>
            </div>

            {/* Footer Bottom Section */}
            <hr className="w-1/2 mx-auto opacity-60" />
            <div className="text-center py-5 text-white opacity-70">
                <p><small>© 2023 Learning Point Ltd. All rights reserved.</small></p>
            </div>
        </footer>
    );
};

export default Footer;
