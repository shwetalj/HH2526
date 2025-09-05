const missionData = [
  {
    id: '01',
    name: 'Surface Brushing',
    description: 'Brush away sediment to uncover artifacts. Clean and uncover buried artifacts without damaging them.',
    hint_image: 'mission_cards/M01_Surface_Brushing',
    video_id: 'OUHg0bMwHtM',
    points: '• Soil deposits cleared: 10 pts each<br>• Brush not touching dig site: 10 pts',
    start_time: 6,
    end_time: 126,
    position: { x: 15, y: 42 }
  },
  {
    id: '02',
    name: 'Map Reveal',
    description: 'Shift and remove topsoil to reveal sections of a hidden map.',
    hint_image: 'mission_cards/M02_Map_Reward',
    video_id: 'b-7zkBkgNUw',
    points: '• Topsoil sections cleared: 10 pts each',
    start_time: 6,
    end_time: 126,
    position: { x: 19, y: 17 }
  },
  {
    id: '03',
    name: 'Mineshaft Explorer',
    description: 'Your team\'s minecart must pass completely through the mineshaft entry.',
    hint_image: 'mission_cards/M03_Mineshaft_Explorers',
    video_id: 'y6RxJpgBOQM',
    points: '• Minecart on opposing field: 30 pts<br>• Bonus if opposing cart on your field: +10 pts',
    start_time: 6,
    end_time: 126,
    position: { x: 37.5, y: 14 }
  },
  {
    id: '04',
    name: 'Careful Recovery',
    description: 'Carefully extract the precious artifact from the mine, ensuring the site remains stable.',
    hint_image: 'mission_cards/M04_Careful_Recovery',
    video_id: 'MX2WMQ4vN0g',
    points: '• Artifact not touching mine: 30 pts<br>• Both supports standing: 10 pts',
    start_time: 6,
    end_time: 126,
    position: { x: 34, y: 30 }
  },
  {
    id: '05',
    name: 'Who Lived Here?',
    description: 'Rebuild the structure to restore a vital part of the village where people once lived.',
    hint_image: 'mission_cards/M05_Who_Lived_Here',
    video_id: 'JmYsPn4cig8',
    points: '• Structure floor completely upright: 30 pts',
    start_time: 6,
    end_time: 126,
    position: { x: 73.5, y: 14.9 }
  },
  {
    id: '06',
    name: 'Forge',
    description: 'Release the ore blocks from the forge. One block holds a mysterious artifact.',
    hint_image: 'mission_cards/M06_Forge',
    video_id: 'szFSKDQCFFw',
    points: '• Ore blocks not touching forge: 10 pts each',
    start_time: 6,
    end_time: 126,
    position: { x: 79, y: 26.7 }
  },
  {
    id: '07',
    name: 'Heavy Lifting',
    description: 'Move the millstone that was used to process grain.',
    hint_image: 'mission_cards/M07_Heavy_Lifting',
    video_id: '6xcrIo-2WJ8',
    points: '• Millstone not touching base: 30 pts',
    start_time: 6,
    end_time: 126,
    position: { x: 84.2, y: 15 }
  },
  {
    id: '08',
    name: 'Silo',
    description: 'Empty the silo of the preserved food so it can be analyzed at the lab.',
    hint_image: 'mission_cards/M08_Silo',
    video_id: 'MbvDiuorKsc',
    points: '• Preserved pieces outside silo: 10 pts each',
    start_time: 6,
    end_time: 126,
    position: { x: 83.6, y: 45.5 }
  },
  {
    id: '09',
    name: 'What\'s on Sale?',
    description: 'Restore the market stall and reveal items that were once traded.',
    hint_image: 'mission_cards/M09_Rock_on_Slab',
    video_id: 'yymtNugu4V4',
    points: '• Roof completely raised: 20 pts<br>• Market wares raised: 10 pts',
    start_time: 6,
    end_time: 126,
    position: { x: 65.7, y: 47.7 }
  },
  {
    id: '10',
    name: 'Tip the Scales',
    description: 'Use this ancient tool that ensured fair and balanced prices.',
    hint_image: 'mission_cards/M10_Tip_the_Scales',
    video_id: 'RX8MMw_MJ9g',
    points: '• Scale tipped & touching mat: 20 pts<br>• Scale pan removed: 10 pts',
    start_time: 6,
    end_time: 126,
    position: { x: 58.2, y: 51.8 }
  },
  {
    id: '11',
    name: 'Angler Artifacts',
    description: 'Use the crane to excavate artifacts discovered at the port.',
    hint_image: 'mission_cards/M11_Angler_Artifacts',
    video_id: 'qVrT1DH4Zh8',
    points: '• Artifacts raised above ground: 20 pts<br>• Bonus if crane flag lowered: +10 pts',
    start_time: 6,
    end_time: 126,
    position: { x: 58.1, y: 92.9 }
  },
  {
    id: '12',
    name: 'Salvage Operation',
    description: 'Excavate the ancient ship without damaging its delicate structure.',
    hint_image: 'mission_cards/M12_Salvage_Operation',
    video_id: 'hFzNIv1NBzg',
    points: '• Sand completely cleared: 20 pts<br>• Ship completely raised: 10 pts',
    start_time: 6,
    end_time: 126,
    position: { x: 46.8, y: 93 }
  },
  {
    id: '13',
    name: 'Statue Rebuild',
    description: 'Reconstruct the statue to help piece together its historic significance.',
    hint_image: 'mission_cards/M13_Statue_Rebuild',
    video_id: '1yyh08hg398',
    points: '• Statue completely raised: 30 pts',
    start_time: 6,
    end_time: 126,
    position: { x: 44.2, y: 46.5 }
  },
  {
    id: '14',
    name: 'Forum',
    description: 'Deliver artifacts to the forum and choose significant items to display.',
    hint_image: 'mission_cards/M14_Forum',
    video_id: 'Pq9d-23TMos',
    points: '• Each artifact in forum: 5 pts<br>(Brush, Topsoil, Precious Artifact, Minecart, Ore, Millstone, Scale Pan)',
    start_time: 6,
    end_time: 126,
    position: { x: 38, y: 50 }
  },
  {
    id: '15',
    name: 'Site Marking',
    description: 'Place flags to mark locations for further study.',
    hint_image: 'mission_cards/M15_Site_Marking',
    video_id: 'd6cNKGmYxh4',
    points: '• Each site with flag: 10 pts',
    start_time: 6,
    end_time: 126,
    position: { x: 0, y: 0 } /* Position not specified in test file */
  },
  {
    id: 'PT',
    name: 'Precision Tokens',
    description: 'Start with 6 tokens. Lose one for each robot interruption outside home.',
    hint_image: 'mission_cards/Precision_Tokens',
    video_id: null,
    points: '1 token: 10 pts<br>2 tokens: 15 pts<br>3 tokens: 25 pts<br>4 tokens: 35 pts<br>5-6 tokens: 50 pts',
    start_time: null,
    end_time: null,
    position: null
  }
];
