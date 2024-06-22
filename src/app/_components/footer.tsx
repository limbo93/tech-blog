import Container from "@/app/_components/container";
import { EXAMPLE_PATH } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200">
      <Container>
        <div className="py-3 flex flex-col items-center">
          <span className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} limbo93. All Rights Reserved.
          </span>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
