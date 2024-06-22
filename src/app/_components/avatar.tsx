type Props = {
  name: string;
  picture: string;
};

const Avatar = ({ name, picture }: Props) => {
  return (
    <div className="flex items-center">
      {/* <img src={picture} className="w-12 h-12 rounded-full mr-4" alt={name} /> */}

      <div className='relative w-12 h-12 bg-gray-100 flex justify-center items-center rounded-full mr-4'>
        <span className='text-gray-600 text-xl font-bold'>{name.substring(0, 1)}</span>
      </div>

      <div className="text-xl font-bold">{name}</div>
    </div>
  );
};

export default Avatar;
