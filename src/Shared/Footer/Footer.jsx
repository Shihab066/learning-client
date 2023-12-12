import { BiMailSend, BiPhone } from "react-icons/bi";
import { IoLocationSharp } from "react-icons/io5";



const Footer = () => {
    
    return (
        <>
            <footer className="footer p-10 bg-[#0079FF] text-white mt-20 grid grid-cols-2 md:flex md:justify-evenly">
                <div>
                    <h2 className='font-semibold text-xl'>𝙎𝙥𝙤𝙧𝙩𝙀𝙓</h2>
                    <p>SportEX Ltd.<br />Best sports academy</p>
                </div>
                <div>
                    <span className="footer-title">Contact us</span>
                    <a className="link link-hover flex gap-1"><BiMailSend className="text-xl"></BiMailSend> info@sportex.com</a>
                    <a className="link link-hover flex gap-1"><BiPhone className="text-xl"></BiPhone> +1 (587) 853-4367</a>
                    <a className="link link-hover flex gap-1"><BiPhone className="text-xl"></BiPhone> (465) 867-5309</a>

                </div>
                <div>
                    <span className="footer-title">Company</span>
                    <a className="link link-hover">About us</a>
                    <a className="link link-hover">Contact</a>
                    <a className="link link-hover">Jobs</a>
                </div>
                <div>
                    <span className="footer-title">Legal</span>
                    <a className="link link-hover">Terms of use</a>
                    <a className="link link-hover">Privacy policy</a>
                    <a className="link link-hover">Cookie policy</a>
                </div>
                <div>
                    <span className="footer-title">Address</span>
                    <a className="link link-hover flex">
                        <IoLocationSharp className="text-xl"></IoLocationSharp>
                        San Francisco,CA 94107</a>
                    <a className="link link-hover flex"><IoLocationSharp className="text-xl"></IoLocationSharp>Pine Avenue,
                        Brooklyn,<br/> NY 10001,
                        United States</a>                    
                </div>
                <div>

                </div>
            </footer>
            <div className='bg-[#0079FF] text-white text-center pb-5'>
                <p><small>© 2023 SportEX Ltd. All rights reserved.</small></p>
            </div>
        </>

    );
};

export default Footer;