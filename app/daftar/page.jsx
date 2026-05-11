const handleSignUp = async (email, password, fullName) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName, // Menyimpan nama lengkap ke metadata
      },
    },
  })

  if (error) {
    console.error("Error pendaftaran:", error.message)
  } else {
    alert("Pendaftaran berhasil! Silakan cek email atau langsung login.")
  }
}