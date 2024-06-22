type Props = {
  name: string;
  avatar: string;
};

const Avatar = ({ name, avatar }: Props) => {
  return (
    <div className="flex items-center">
      <div className='relative w-12 h-12 bg-gray-100 flex justify-center items-center rounded-full mr-4'>
        <span className='text-gray-600 text-xl font-bold'>{avatar}</span>
      </div>

      <div className="text-xl font-bold">{name}</div>
    </div>
  );
};

export default Avatar;
