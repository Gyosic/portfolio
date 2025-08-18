import FramerWrapper from "@/components/animation/FramerWrapper";

const Heading = ({ children }: { children: React.ReactNode }) => {
  // CUSTOM HEADING FOR ALL PAGE
  return (
    <FramerWrapper y={0} x={-100}>
      <h1 className="name_underline font-bold font-poppins text-4xl text-primary max-sm:text-2xl">
        {children}
      </h1>
    </FramerWrapper>
  );
};

export default Heading;
